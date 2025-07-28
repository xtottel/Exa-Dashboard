"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  value?: string;
  onChange: (url?: string) => void;
  
}

export const FileUpload = ({ value, onChange }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      await startUpload(file);
    },
  });

  const startUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress (replace with actual API call)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);

    try {
      // In a real app, you would upload to your API here
      // const formData = new FormData();
      // formData.append("file", file);
      // const response = await axios.post("/api/upload", formData, {
      //   onUploadProgress: (progressEvent) => {
      //     const progress = Math.round(
      //       (progressEvent.loaded * 100) / (progressEvent.total || 1)
      //     );
      //     setUploadProgress(progress);
      //   }
      // });

      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      clearInterval(interval);
      setUploadProgress(100);

      // In a real app, you would use the URL from the response
      // onChange(response.data.url);
      const mockUrl = URL.createObjectURL(file);
      onChange(mockUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      onChange(undefined);
    } finally {
      setIsUploading(false);
    }
  };

  const onRemove = () => {
    onChange(undefined);
  };

  if (value) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm truncate max-w-[180px]">
            {value.includes("blob") ? "Uploaded file" : value.split("/").pop()}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          disabled={isUploading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2">
        <UploadCloud className="h-10 w-10 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">
          <p>Drag & drop your file here, or click to select</p>
          <p className="text-xs mt-1">Supports: JPG, PNG, PDF (Max 5MB)</p>
        </div>
        
        {isUploading && (
          <div className="w-full mt-4 max-w-xs mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="relative h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};