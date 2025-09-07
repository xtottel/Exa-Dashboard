// controllers/sender-id/index.ts
import { createSenderId } from "./createSenderId.controller";
import { getSenderIds } from "./getSenderIds.controller";
import { updateSenderId } from "./updateSenderId.controller";
import { deleteSenderId } from "./deleteSenderId.controller";
import { verifySenderId } from "./verifySenderId.controller";

export const senderIdController = {
  createSenderId,
  getSenderIds,
  updateSenderId,
  deleteSenderId,
  verifySenderId
};