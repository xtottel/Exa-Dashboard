// services/parentProvider.service.ts
import axios from 'axios';
import qs from 'qs';

interface ParentProviderConfig {
  baseURL: string;
  apiKey: string;
  defaultSenderId: string;
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

// Nalo specific error codes mapping
const NALO_ERROR_CODES: { [key: string]: string } = {
  '1702': 'Invalid URL Error - Missing or blank parameters',
  '1703': 'Invalid value in username or password field',
  '1704': 'Invalid value in "type" field',
  '1705': 'Invalid Message',
  '1706': 'Invalid Destination',
  '1707': 'Invalid Source (Sender)',
  '1708': 'Invalid value for "dlr" field',
  '1709': 'User validation failed',
  '1710': 'Internal Error',
  '1025': 'Insufficient Credit - User',
  '1026': 'Insufficient Credit - Reseller'
};

class ParentProviderService {
  private config: ParentProviderConfig;

  constructor() {
    this.config = {
      baseURL: process.env.PARENT_PROVIDER_URL || 'https://sms.nalosolutions.com/smsbackend/clientapi/Resl_Nalo',
      apiKey: process.env.PARENT_PROVIDER_API_KEY || 'DAQS0uWPauS6fCCiBALtEgtrov7oZeytAcr6wbMgoeCVwkIM7eQhbP8XIdnm0idN',
      defaultSenderId: process.env.DEFAULT_SENDER_ID || 'Sendexa'
    };
  }

  /**
   * Send SMS through Nalo Solutions provider
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

      // Prepare request parameters
      const params = {
        key: this.config.apiKey,
        type: '0', // 0 for text message
        destination: recipient,
        dlr: '1', // 1 for delivery report required
        source: senderId || this.config.defaultSenderId,
        message: message
      };

      // URL encode the parameters
      const queryString = qs.stringify(params, { encode: true });

      // Make the API request
      const response = await axios.get(`${this.config.baseURL}/send-message/?${queryString}`, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Parse Nalo Solutions response
      return this.parseNaloResponse(response.data, messageId, recipient);

    } catch (error) {
      console.error('Parent provider API error:', error);
      
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
          return {
            success: false,
            status: 'http_error',
            message: `HTTP ${error.response.status}: ${error.response.statusText}`,
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
   * Validate parameters before sending to Nalo
   */
  private validateParameters(recipient: string, message: string, senderId: string): string | null {
    if (!recipient || !message || !senderId) {
      return 'Missing required parameters: recipient, message, or senderId';
    }

    // Validate recipient format (should be 233XXXXXXXXX)
    if (!/^233[234][0-9]{8}$/.test(recipient)) {
      return 'Invalid recipient format. Must be 233XXXXXXXXX';
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
   * Parse Nalo Solutions API response with detailed error handling
   */
  private parseNaloResponse(response: any, messageId: string, recipient: string): ProviderResponse {
    try {
      // Nalo returns responses in format: "CODE|MESSAGE_ID|DESTINATION|MESSAGE"
      if (typeof response === 'string') {
        const parts = response.split('|');
        const statusCode = parts[0].trim();

        // Handle success case
        if (statusCode === '1701') {
          const externalId = parts[1] || messageId;
          const responseMessage = parts.slice(3).join('|') || 'Message submitted successfully';
          
          return {
            success: true,
            status: 'submitted',
            externalId: externalId,
            message: responseMessage
          };
        }

        // Handle error cases with specific error codes
        if (NALO_ERROR_CODES[statusCode]) {
          return {
            success: false,
            status: this.mapNaloStatus(statusCode),
            message: NALO_ERROR_CODES[statusCode],
            errorCode: statusCode
          };
        }

        // Handle unknown error codes
        return {
          success: false,
          status: 'rejected',
          message: parts.slice(1).join('|') || `Unknown error from provider (Code: ${statusCode})`,
          errorCode: statusCode
        };
      }

      // Handle JSON responses if provider returns them
      if (typeof response === 'object') {
        const statusCode = response.code || response.statusCode;
        
        if (statusCode === '1701' || response.status === 'success') {
          return {
            success: true,
            status: 'submitted',
            externalId: response.message_id || messageId,
            message: response.message || 'Message submitted successfully'
          };
        }

        return {
          success: false,
          status: 'rejected',
          message: response.message || response.error || 'Unknown error from provider',
          errorCode: statusCode
        };
      }

      return {
        success: false,
        status: 'failed',
        message: 'Invalid response format from provider',
        errorCode: '1710'
      };

    } catch (parseError) {
      console.error('Error parsing provider response:', parseError);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to parse provider response',
        errorCode: '1710'
      };
    }
  }

  /**
   * Map Nalo error codes to internal status codes
   */
  private mapNaloStatus(errorCode: string): string {
    const statusMap: { [key: string]: string } = {
      '1702': 'invalid_parameters',
      '1703': 'authentication_error',
      '1704': 'invalid_parameters',
      '1705': 'invalid_message',
      '1706': 'invalid_destination',
      '1707': 'invalid_sender',
      '1708': 'invalid_parameters',
      '1709': 'authentication_error',
      '1710': 'provider_error',
      '1025': 'insufficient_credit',
      '1026': 'insufficient_credit'
    };

    return statusMap[errorCode] || 'rejected';
  }

  /**
   * Check account balance with provider
   */
  async checkBalance(): Promise<{ balance: number; currency: string; error?: string }> {
    try {
      // Nalo might have a balance endpoint - adjust based on their actual API
      // This is a placeholder implementation
      const params = {
        key: this.config.apiKey,
        action: 'balance'
      };

      const queryString = qs.stringify(params, { encode: true });
      const response = await axios.get(`${this.config.baseURL}/check-balance/?${queryString}`);

      // Parse balance response - adjust based on actual API response
      // Nalo might return balance in their specific format
      if (typeof response.data === 'string') {
        const parts = response.data.split('|');
        if (parts[0] === '1701') {
          return {
            balance: parseFloat(parts[1] || '0'),
            currency: 'GHS'
          };
        } else {
          return {
            balance: 0,
            currency: 'GHS',
            error: NALO_ERROR_CODES[parts[0]] || 'Failed to check balance'
          };
        }
      }

      return {
        balance: parseFloat(response.data.balance || '0'),
        currency: response.data.currency || 'GHS'
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
   * Get delivery status for a message
   */
  async getDeliveryStatus(externalId: string): Promise<{ 
    status: string; 
    timestamp?: Date;
    error?: string;
  }> {
    try {
      const params = {
        key: this.config.apiKey,
        message_id: externalId
      };

      const queryString = qs.stringify(params, { encode: true });
      const response = await axios.get(`${this.config.baseURL}/delivery-status/?${queryString}`);

      // Parse delivery status - Nalo might return specific format
      if (typeof response.data === 'string') {
        const parts = response.data.split('|');
        if (parts[0] === '1701') {
          // Success - parse delivery status
          const status = this.parseDeliveryStatus(parts[1]);
          return {
            status: status,
            timestamp: new Date()
          };
        } else {
          return {
            status: 'unknown',
            error: NALO_ERROR_CODES[parts[0]] || 'Failed to get delivery status'
          };
        }
      }

      return {
        status: response.data.status || 'unknown',
        timestamp: response.data.timestamp ? new Date(response.data.timestamp) : undefined
      };

    } catch (error) {
      console.error('Delivery status check error:', error);
      return {
        status: 'unknown',
        error: 'Failed to get delivery status'
      };
    }
  }

  /**
   * Parse Nalo delivery status codes
   */
  private parseDeliveryStatus(statusCode: string): string {
    // Map Nalo delivery status codes to internal statuses
    // Adjust based on Nalo's actual delivery status documentation
    const deliveryStatusMap: { [key: string]: string } = {
      'DELIVRD': 'delivered',
      'EXPIRED': 'expired',
      'DELETED': 'deleted',
      'UNDELIV': 'undelivered',
      'ACCEPTD': 'accepted',
      'UNKNOWN': 'unknown',
      'REJECTD': 'rejected'
    };

    return deliveryStatusMap[statusCode] || 'unknown';
  }
}

export const parentProviderService = new ParentProviderService();