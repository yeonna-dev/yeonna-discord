import { parseParamsToArray } from 'comtroller';
import { Core, NonPendingRoleRequest } from 'yeonna-core';
import { RoleRequest } from 'yeonna-core/dist/modules/discord/services/RoleRequestsService';

import { Discord } from '../utilities/discord';
import { Log } from '../utilities/logger';

// TODO: Update responses
export async function roleRequestResponse(
  discord: Discord,
  params: string,
  isApproved: Boolean,
)
{
  const [requestId] = parseParamsToArray(params);
  if(!requestId)
    return discord.send('No role request ID provided.');

  const requestResponseParams =
  {
    requestId,
    approverDiscordId: discord.getAuthorId(),
  };

  discord.startTyping();

  let approvedRoleRequest: RoleRequest | undefined;
  try
  {
    approvedRoleRequest = await (isApproved
      ? Core.Discord.approveRoleRequest(requestResponseParams)
      : Core.Discord.declineRoleRequest(requestResponseParams)
    );
  }
  catch(error: any)
  {
    if(!(error instanceof NonPendingRoleRequest))
      Log.error(error);

    discord.send(
      `Cannot ${isApproved ? 'approve' : 'decline'} the role request.`
      + ' It might not be a pending role request.'
    );
  }

  if(!approvedRoleRequest)
    return;

  const { roleName, roleColor, requesterDiscordId } = approvedRoleRequest;

  if(isApproved)
  {
    try
    {
      const createdRoleId = await discord.createRole({
        name: roleName,
        color: roleColor,
      });

      if(!createdRoleId)
        return;

      await discord.assignRole(requesterDiscordId, createdRoleId);
    }
    catch(error: any)
    {
      Log.error(error);
      return discord.send(
        'Cannot create and assign the role.'
        + ' I might not have the permissions to do so.'
      );
    }
  }

  const actionString = isApproved ? 'approved' : 'declined';
  let response = `Your request for ${roleName ? `the "${roleName}"` : 'a'}`
    + ` role has been **${actionString}**.`;
  if(isApproved)
    response += '\nYou now have the role.';

  try
  {
    discord.sendToUser(requesterDiscordId, response);
    discord.send(`Role request with ID \`${requestId}\` has been **${actionString}**.`);
  }
  catch(error)
  {
    Log.error(error);
  }
}
