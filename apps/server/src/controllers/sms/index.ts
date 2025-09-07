// controllers/sms/index.ts
import { sendSMS } from "./sendSMS.controller";
import { getSMSHistory } from "./getSMSHistory.controller";
import { getSMSDetails } from "./getSMSDetails.controller";
import { getSMSStats } from "./getSMSStats.controller";
import { getSMSAnalytics } from "./getSMSAnalytics.controller";


export const smsController = {
  sendSMS,
  getSMSHistory,
  getSMSDetails,
  getSMSStats,
  getSMSAnalytics
};