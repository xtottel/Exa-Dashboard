// controllers/credits/index.ts
import { getCreditBalance } from "./getCreditBalance.controller";
import { purchaseCredits } from "./purchaseCredits.controller";
import { getCreditHistory } from "./getCreditHistory.controller";
import { transferCredits } from "./transferCredits.controller";
import { getInvoices } from "./getInvoices.controller";
import { getInvoice } from "./getInvoice.controller";

export const creditsController = {
  getCreditBalance,
  purchaseCredits,
  getCreditHistory,
  transferCredits,
  getInvoices,
  getInvoice
};