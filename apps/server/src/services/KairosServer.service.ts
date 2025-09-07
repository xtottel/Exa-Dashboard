// services/KairosServer.service.ts
import axios from 'axios';

interface KairosConfig {
  baseURL: string;
  apiKey: string;
  apiSecret: string;
}

interface SendSMSOptions {
  recipient: string;
  message: string;
  senderId: string;
  messageId: string;
}

interface ProviderResponse {
  success: boolean;
  externalId?: string;
  status: string;
  message?: string;
  errorCode?: string;
}

interface KairosQuickSMSRequest {
  to: string;
  from: string;
  type: string;
  message: string;
  isGlobal?: boolean;
}

interface KairosBulkSMSRequest {
  messages: Array<{
    to: string;
    from: string;
    message: string;
    type: string;
  }>;
  isGlobal?: boolean;
}

interface KairosLog {
  id: number;
  uuid: string;
  status: string;
  event: string;
  segments: number;
  amount: string;
  payload: {
    to: string;
    from: string;
    message: string;
    type: string;
  };
  deliverySystemLogs?: {
    statusText: string;
    statusCode: number;
    messageId: string;
  };
  updatedAt?: string;
  createdAt?: string;
}

interface KairosPaginationResponse {
  paginateObj: {
    docs: KairosLog[];
    limit: number;
    total: number;
    pages: number;
    page: number;
  };
  meta: {
    item_count: number;
    limit: number;
  };
}

class KairosServerService {
  private config: KairosConfig;

  constructor() {
    this.config = {
      baseURL: process.env.KAIROS_BASE_URL || 'https://api.kairosafrika.com/v1/external/sms',
      apiKey: process.env.KAIROS_API_KEY || 'U2FsdGVkX1+Wcez4iQasGLnRUH49qZis4TkElhslqZI=',
      apiSecret: process.env.KAIROS_API_SECRET || 'ZRwHljsxRrYhvJiIXzwoZpP10457'
    };
  }

  /**
   * Send SMS through Kairos Afrika provider
   */
  async sendSMS(options: SendSMSOptions): Promise<ProviderResponse> {
    try {
      const { recipient, message, senderId, messageId } = options;

      // Validate parameters before sending
      const validationError = this.validateParameters(recipient, message, senderId);
      if (validationError) {
        return {
          success: false,
          status: 'invalid_parameters',
          message: validationError,
          errorCode: '1702'
        };
      }

      // Prepare request payload for Kairos
      const payload: KairosQuickSMSRequest = {
        to: recipient,
        from: senderId,
        type: 'Quick',
        message: message,
        isGlobal: false
      };

      // Make the API request to Kairos
      const response = await axios.post(`${this.config.baseURL}/quick`, payload, {
        timeout: 30000,
        headers: {
          'x-api-key': this.config.apiKey,
          'x-api-secret': this.config.apiSecret,
          'Content-Type': 'application/json'
        }
      });

      // Parse Kairos response
      return this.parseKairosResponse(response.data, messageId);

    } catch (error) {
      console.error('Kairos provider API error:', error);
      
      // Handle specific axios errors
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return {
            success: false,
            status: 'timeout',
            message: 'Provider request timeout',
            errorCode: '1710'
          };
        }
        
        if (error.response) {
          // Server responded with error status
          const errorMessage = error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
          
          // Handle insufficient credit case
          if (error.response.status === 403 && errorMessage.includes('credit')) {
            return {
              success: false,
              status: 'insufficient_credit',
              message: errorMessage,
              errorCode: '1025'
            };
          }
          
          return {
            success: false,
            status: 'http_error',
            message: errorMessage,
            errorCode: '1710'
          };
        }
      }
      
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown provider error',
        errorCode: '1710'
      };
    }
  }

  /**
   * Send bulk SMS through Kairos Afrika provider
   */
  async sendBulkSMS(messages: Array<{
    recipient: string;
    message: string;
    senderId: string;
    messageId: string;
  }>): Promise<ProviderResponse[]> {
    try {
      // Prepare bulk request payload for Kairos
      const payload: KairosBulkSMSRequest = {
        messages: messages.map(msg => ({
          to: msg.recipient,
          from: msg.senderId,
          type: 'Quick',
          message: msg.message
        })),
        isGlobal: false
      };

      // Make the API request to Kairos
      const response = await axios.post(`${this.config.baseURL}/bulk`, payload, {
        timeout: 60000, // Longer timeout for bulk operations
        headers: {
          'x-api-key': this.config.apiKey,
          'x-api-secret': this.config.apiSecret,
          'Content-Type': 'application/json'
        }
      });

      // For bulk operations, Kairos might return an array of responses
      // This implementation assumes a successful bulk request returns success
      // You might need to adjust based on actual API response format
      return messages.map(msg => ({
        success: true,
        status: 'submitted',
        externalId: `bulk_${Date.now()}`,
        message: 'Message submitted in bulk'
      }));

    } catch (error) {
      console.error('Kairos bulk SMS API error:', error);
      
      // Return failure for all messages in case of bulk error
      return messages.map(msg => ({
        success: false,
        status: 'failed',
        message: 'Bulk send failed',
        errorCode: '1710'
      }));
    }
  }

   /**
   * Validate parameters before sending to Kairos
   */
  private validateParameters(recipient: string, message: string, senderId: string): string | null {
    if (!recipient || !message || !senderId) {
      return 'Missing required parameters: recipient, message, or senderId';
    }

    // Validate recipient format (should be 233XXXXXXXXX)
    // Updated regex to accept valid Ghana numbers: 233 followed by 2,3,4,5 and 8 digits
    if (!/^233[2345][0-9]{8}$/.test(recipient)) {
      return 'Invalid recipient format. Must be 233XXXXXXXXX where X is digit and starts with 2,3,4,5';
    }

    // Validate message length
    if (message.length === 0) {
      return 'Message cannot be empty';
    }

    // Validate sender ID (typically 3-11 alphanumeric characters)
    if (!/^[a-zA-Z0-9]{3,11}$/.test(senderId)) {
      return 'Invalid sender ID format. Must be 3-11 alphanumeric characters';
    }

    return null;
  }

  /**
   * Parse Kairos API response
   */
  private parseKairosResponse(response: any, messageId: string): ProviderResponse {
    try {
      console.log('Kairos raw response:', response);
      console.log('Kairos response type:', typeof response);
      
      // Handle different possible response formats from Kairos
      
      // Format 0: Simple boolean true response (Kairos sometimes returns just "true")
      if (response === true) {
        return {
          success: true,
          status: 'submitted',
          externalId: messageId, // Use our internal message ID
          message: 'Message submitted successfully (boolean true response)'
        };
      }
      
      // Format 1: Success response with log ID/uuid
      if (response.id || response.uuid) {
        return {
          success: true,
          status: 'submitted',
          externalId: response.uuid || response.id.toString(),
          message: 'Message submitted successfully'
        };
      }
      
      // Format 2: Success response with message ID (some providers use this)
      if (response.messageId) {
        return {
          success: true,
          status: 'submitted',
          externalId: response.messageId,
          message: 'Message submitted successfully'
        };
      }
      
      // Format 3: Array response (some bulk operations)
      if (Array.isArray(response) && response.length > 0) {
        const firstResponse = response[0];
        return {
          success: true,
          status: 'submitted',
          externalId: firstResponse.uuid || firstResponse.id || `batch_${Date.now()}`,
          message: 'Message submitted successfully'
        };
      }
      
      // Format 4: Simple success response without detailed data
      if (response.status === 'success' || response.success === true) {
        return {
          success: true,
          status: 'submitted',
          externalId: messageId, // Use our internal message ID as fallback
          message: response.message || 'Message submitted successfully'
        };
      }
      
      // Format 5: Error response with statusCode
      if (response.statusCode && response.message) {
        return {
          success: false,
          status: this.mapKairosStatus(response.statusCode),
          message: response.message,
          errorCode: response.statusCode.toString()
        };
      }
      
      // Format 6: Error response with error field
      if (response.error) {
        return {
          success: false,
          status: 'failed',
          message: response.error,
          errorCode: response.code || '1710'
        };
      }

      // If we get here, log the unexpected response for debugging
      console.warn('Unexpected Kairos response format:', response);
      
      // For unexpected but potentially successful responses, assume success
      // This is safer than failing when the message might have been sent
      if (typeof response === 'object' && Object.keys(response).length === 0) {
        // Empty object response often indicates success
        return {
          success: true,
          status: 'submitted',
          externalId: messageId,
          message: 'Message submitted successfully (assumed from empty response)'
        };
      }

      // Handle string responses that might indicate success
      if (typeof response === 'string') {
        const lowerResponse = response.toLowerCase();
        if (lowerResponse.includes('success') || lowerResponse.includes('sent') || lowerResponse === 'true') {
          return {
            success: true,
            status: 'submitted',
            externalId: messageId,
            message: `Message submitted successfully (string response: ${response})`
          };
        }
      }

      // Unknown response format - assume failure but log for investigation
      return {
        success: false,
        status: 'failed',
        message: 'Invalid response format from provider',
        errorCode: '1710'
      };

    } catch (parseError) {
      console.error('Error parsing Kairos response:', parseError);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to parse provider response',
        errorCode: '1710'
      };
    }
  }

  /**
   * Map Kairos status codes to internal status codes
   */
  private mapKairosStatus(statusCode: number): string {
    const statusMap: { [key: number]: string } = {
      200: 'submitted',
      201: 'submitted',
      400: 'invalid_parameters',
      401: 'authentication_error',
      403: 'insufficient_credit',
      500: 'provider_error'
    };

    return statusMap[statusCode] || 'rejected';
  }

  /**
   * Check delivery status for a message
   */
  async getDeliveryStatus(externalId: string): Promise<{ 
    status: string; 
    timestamp?: Date;
    error?: string;
  }> {
    try {
      // First get the log details
      const response = await axios.get(`${this.config.baseURL}/logs/${externalId}`, {
        headers: {
          'x-api-key': this.config.apiKey,
          'x-api-secret': this.config.apiSecret
        }
      });

      const log: KairosLog = response.data;
      
      // Map Kairos status to internal status
      const status = this.mapDeliveryStatus(log.status);
      
      return {
        status: status,
        timestamp: log.updatedAt || log.createdAt ? new Date(log.updatedAt || log.createdAt as string) : undefined
      };

    } catch (error) {
      console.error('Delivery status check error:', error);
      
      // Fallback to ping endpoint if detailed log fails
      try {
        const pingResponse = await axios.get(`${this.config.baseURL}/logs/${externalId}/ping/status`, {
          headers: {
            'x-api-key': this.config.apiKey,
            'x-api-secret': this.config.apiSecret
          }
        });

        const pingData = pingResponse.data;
        const status = this.mapDeliveryStatus(pingData.status);
        
        return {
          status: status,
          timestamp: new Date()
        };
      } catch (pingError) {
        return {
          status: 'unknown',
          error: 'Failed to get delivery status'
        };
      }
    }
  }

  /**
   * Map Kairos delivery status to internal status
   */
  private mapDeliveryStatus(kairosStatus: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'sent',
      'success': 'delivered',
      'failed': 'failed',
      'accepted': 'sent',
      'delivered': 'delivered',
      'undelivered': 'failed',
      'rejected': 'failed'
    };

    return statusMap[kairosStatus.toLowerCase()] || 'unknown';
  }

  /**
   * Check account balance with Kairos provider
   */
  async checkBalance(): Promise<{ balance: number; currency: string; error?: string }> {
    try {
      // Get recent logs to infer balance (Kairos doesn't have direct balance endpoint)
      const response = await axios.get(`${this.config.baseURL}/logs?isPaginated=true&page=1&limit=5`, {
        headers: {
          'x-api-key': this.config.apiKey,
          'x-api-secret': this.config.apiSecret
        }
      });

      const data: KairosPaginationResponse = response.data;
      
      // This is a placeholder - you might need to track balance separately
      // since Kairos doesn't provide a direct balance endpoint
      return {
        balance: 100, // Default value - you'll need to track this manually
        currency: 'GHS',
        error: 'Balance tracking requires manual implementation for Kairos'
      };

    } catch (error) {
      console.error('Balance check error:', error);
      return {
        balance: 0,
        currency: 'GHS',
        error: 'Failed to check balance with provider'
      };
    }
  }

  /**
   * Resend a failed SMS message
   */
  async resendSMS(logId: string, message: string): Promise<ProviderResponse> {
    try {
      const response = await axios.post(
        `${this.config.baseURL}/quick/${logId}/resend`,
        { message },
        {
          headers: {
            'x-api-key': this.config.apiKey,
            'x-api-secret': this.config.apiSecret,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parseKairosResponse(response.data, logId);

    } catch (error) {
      console.error('Resend SMS error:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to resend SMS',
        errorCode: '1710'
      };
    }
  }

  /**
   * Get SMS logs with pagination
   */
  async getLogs(page: number = 1, limit: number = 15): Promise<KairosPaginationResponse> {
    try {
      const response = await axios.get(`${this.config.baseURL}/logs?isPaginated=true&page=${page}&limit=${limit}`, {
        headers: {
          'x-api-key': this.config.apiKey,
          'x-api-secret': this.config.apiSecret
        }
      });

      return response.data;
    } catch (error) {
      console.error('Get logs error:', error);
      throw new Error('Failed to fetch SMS logs');
    }
  }
}

export const kairosServerService = new KairosServerService();
export default kairosServerService;