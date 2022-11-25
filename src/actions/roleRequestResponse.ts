import { parseParamsToArray } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { RoleRequestsCommandResponse } from 'src/responses/roleRequests';
import { Core, NonPendingRoleRequest } from 'yeonna-core';
import { RoleRequest } from 'yeonna-core/dist/modules/discord/services/RoleRequestsService';

enum Direction
{
  Above = 'above',
  Below = 'below',
}

export async function roleRequestResponse(
  discord: Discord,
  params: string,
  isApproved: boolean,
)
{
  const response = new RoleRequestsCommandResponse(discord);

  /*
    requestId - ID of the role request
    direction - could be `above` or `below`
    relativeRoleId - ID of the role where the new role will be placed relative to,
      depending on the given `direction`
   */
  const [requestId, direction, relativeRoleId] = parseParamsToArray(params);
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

  const respond = () =>
  {
    try
    {
      response.requestResponse(requestId, isApproved);
      response.requestResponseUserDm(requesterDiscordId, roleName, isApproved);
    }
    catch(error)
    {
      Log.error(error);
    }
  };

  if(!isApproved)
    return respond();

  /* Create the role */
  let createdRoleId;
  try
  {
    createdRoleId = await discord.createRole({
      name: roleName,
      color: roleColor,
    });

  }
  catch(error)
  {
    Log.error(error);
  }

  if(!createdRoleId)
    return response.cannotCreateRole();

  /* If a valid direction is given, set the position of the created role
    in the direction relative to the given `relativeRoleId`.
    Only `above` and `below` are the valid directions. */
  const hasValidDirection = Object.values(Direction).includes(direction as Direction);
  if(hasValidDirection && !!relativeRoleId)
  {
    try
    {
      /* Get the position of the relative role. */
      const relativeRole = await discord.getGuildRole(relativeRoleId);
      if(!relativeRole)
        return;

      const relativeRolePosition = relativeRole.position;
      let newRolePosition = 0;
      if(direction === Direction.Above)
        newRolePosition = relativeRolePosition;
      else
        newRolePosition = relativeRolePosition - 1;

      await discord.moveRole(createdRoleId, newRolePosition);
    }
    catch(error)
    {
      Log.error(error);
      response.cannotRelativeMoveRole();
    }
  }

  /* Assign the role to the user that requested it */
  try
  {
    await discord.assignRole(requesterDiscordId, createdRoleId);
  }
  catch(error: any)
  {
    Log.error(error);
    return response.cannotAssignRole();
  }

  respond();
}
