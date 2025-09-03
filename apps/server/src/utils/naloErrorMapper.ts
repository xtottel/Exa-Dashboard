// utils/naloErrorMapper.ts
export const NALO_ERROR_MAP = {
  '1702': {
    status: 'invalid_parameters',
    message: 'Invalid URL Error - Missing or blank parameters',
    shouldCharge: false
  },
  '1703': {
    status: 'authentication_error', 
    message: 'Invalid value in username or password field',
    shouldCharge: false
  },
  '1704': {
    status: 'invalid_parameters',
    message: 'Invalid value in "type" field',
    shouldCharge: false
  },
  '1705': {
    status: 'invalid_message',
    message: 'Invalid Message',
    shouldCharge: true // Charge for invalid message attempts
  },
  '1706': {
    status: 'invalid_destination',
    message: 'Invalid Destination',
    shouldCharge: false // Don't charge for bad numbers
  },
  '1707': {
    status: 'invalid_sender',
    message: 'Invalid Source (Sender)',
    shouldCharge: false
  },
  '1708': {
    status: 'invalid_parameters',
    message: 'Invalid value for "dlr" field',
    shouldCharge: false
  },
  '1709': {
    status: 'authentication_error',
    message: 'User validation failed',
    shouldCharge: false
  },
  '1710': {
    status: 'provider_error',
    message: 'Internal Error',
    shouldCharge: false
  },
  '1025': {
    status: 'insufficient_credit',
    message: 'Insufficient Credit - User',
    shouldCharge: false
  },
  '1026': {
    status: 'insufficient_credit',
    message: 'Insufficient Credit - Reseller',
    shouldCharge: false
  }
};

export function getNaloErrorDetails(errorCode: string) {
  return NALO_ERROR_MAP[errorCode as keyof typeof NALO_ERROR_MAP] || {
    status: 'unknown_error',
    message: `Unknown error (Code: ${errorCode})`,
    shouldCharge: true // Default to charging for unknown errors
  };
}