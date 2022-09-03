import { parseParamsToArray } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { RoleRequestsCommandResponse } from 'src/responses/roleRequests';
import { Core, NonPendingRoleRequest } from 'yeonna-core';
import { RoleRequest } from 'yeonna-core/dist/modules/discord/services/RoleRequestsService';

export async function roleRequestResponse(
  discord: Discord,
  params: string,
  isApproved: boolean,
)
{
  const response = new RoleRequestsCommandResponse(discord);

  const [requestId] = parseParamsToArray(params);
  if(!requestId)
    return response.noIdProvided();

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

    return response.requestResponseFail(isApproved);
  }

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
      return response.cannotAssignRole();
    }
  }

  try
  {
    response.requestResponse(requestId, isApproved);
    response.requestResponseUserDm(requesterDiscordId, roleName, isApproved);
  }
  catch(error)
  {
    Log.error(error);
  }
}
