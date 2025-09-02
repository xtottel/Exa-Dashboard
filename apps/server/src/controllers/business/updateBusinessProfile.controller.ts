// controllers/business/updateBusinessProfile.controller.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Configure multer for file uploads - dynamic destination based on businessId
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const businessId = (req as AuthRequest).user?.businessId;
      if (!businessId) {
        return cb(new Error('Business ID not found'), '');
      }
      
      // Create the full path
      const uploadDir = path.join(process.cwd(), 'uploads', 'business', businessId);
      
      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`Created directory: ${uploadDir}`);
      }
      
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, '');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'logo') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for logo'));
      }
    } else if (file.fieldname === 'businessCertificate') {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only JPEG, PNG, and PDF files are allowed for certificates'));
      }
    } else {
      cb(new Error('Unexpected field'));
    }
  }
});

export const updateBusinessProfile: any[] = [
  // Handle file uploads
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'businessCertificate', maxCount: 1 }
  ]),

  // Main controller function
  async (req: AuthRequest, res: Response) => {
    try {
      console.log('Files received:', req.files);
      console.log('Body received:', req.body);

      const userId = req.user.id;
      const businessId = req.user.businessId;
      
      // Get text fields from body
      const {
        name,
        phone,
        address,
        businessType,
        businessSector,
        description,
        email,
        website,
      } = req.body;

      // Get user with business
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { business: true }
      });

      if (!user || !user.business) {
        return res.status(404).json({
          success: false,
          message: 'Business not found'
        });
      }

      // Handle file uploads
      let logoUrl = user.business.logo;
      let certificateUrl = user.business.businessCertificate;

      // Process logo upload
      if (req.files && 'logo' in req.files && req.files.logo[0]) {
        const logoFile = req.files.logo[0];
        logoUrl = `/uploads/business/${businessId}/${logoFile.filename}`;
        
        console.log('Logo uploaded to:', logoUrl);
        
        // Delete old logo if exists
        if (user.business.logo && user.business.logo.startsWith('/uploads/')) {
          const oldLogoPath = path.join(process.cwd(), user.business.logo.substring(1));
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
            console.log('Deleted old logo:', oldLogoPath);
          }
        }
      }

      // Process certificate upload
      if (req.files && 'businessCertificate' in req.files && req.files.businessCertificate[0]) {
        const certFile = req.files.businessCertificate[0];
        certificateUrl = `/uploads/business/${businessId}/${certFile.filename}`;
        
        console.log('Certificate uploaded to:', certificateUrl);
        
        // Delete old certificate if exists
        if (user.business.businessCertificate && user.business.businessCertificate.startsWith('/uploads/')) {
          const oldCertPath = path.join(process.cwd(), user.business.businessCertificate.substring(1));
          if (fs.existsSync(oldCertPath)) {
            fs.unlinkSync(oldCertPath);
            console.log('Deleted old certificate:', oldCertPath);
          }
        }
      }

      // Update business
      const updatedBusiness = await prisma.business.update({
        where: { id: user.businessId },
        data: {
          name: name || user.business.name,
          phone: phone || user.business.phone,
          address: address || user.business.address,
          businessType: businessType || user.business.businessType,
          businessSector: businessSector || user.business.businessSector,
          description: description || user.business.description,
          email: email || user.business.email,
          website: website || user.business.website,
          logo: logoUrl,
          businessCertificate: certificateUrl,
          updatedAt: new Date()
        }
      });

      res.status(200).json({
        success: true,
        message: 'Business profile updated successfully',
        business: updatedBusiness
      });

    } catch (error) {
      console.error('Update business profile error:', error);
      
      // Clean up uploaded files if error occurred
      if (req.files) {
        if ('logo' in req.files && req.files.logo[0]) {
          fs.unlinkSync(req.files.logo[0].path);
        }
        if ('businessCertificate' in req.files && req.files.businessCertificate[0]) {
          fs.unlinkSync(req.files.businessCertificate[0].path);
        }
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
];