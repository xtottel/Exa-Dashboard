// controllers/api-key/index.ts

import { getApiKeys } from "./getApiKeys.controller";
import { createApiKey } from "./createApiKey.controller";
import { updateApiKey } from "./updateApiKey.controller";
import { deleteApiKey } from "./deleteApiKey.controller";


export const apiKeyController = {
  getApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey,
};