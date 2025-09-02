// controllers/business/index.ts
import { getBusinessProfile } from "./getBusinessProfile.controller";
import { updateBusinessProfile } from "./updateBusinessProfile.controller";
import { getTeamMembers } from "./getTeamMembers.controller";
import { inviteTeamMember } from "./inviteTeamMember.controller";
import { updateTeamMember } from "./updateTeamMember.controller";
import { removeTeamMember } from "./removeTeamMember.controller";
import { cancelInvitation } from "./cancelInvitation.controller";
import { resendInvitation } from "./resendInvitation.controller";
// Note: acceptInvitation is not included here as it's typically used without authentication
import { acceptInvitation } from "./acceptInvitation.controller";

export const businessController = {
  getBusinessProfile,
  updateBusinessProfile,
  getTeamMembers,
  inviteTeamMember,
  updateTeamMember,
  removeTeamMember,
  cancelInvitation,
  resendInvitation,
  acceptInvitation,
};