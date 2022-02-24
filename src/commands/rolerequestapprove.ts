import { Command } from 'comtroller';
import { roleRequestResponse } from '../actions/roleRequestResponse';
import { noRolePermissions } from '../guards/discordMemberPermissions';

export const rolerequestapprove: Command =
{
  name: 'rolerequestapprove',
  aliases: ['rra'],
  guards: [noRolePermissions],
  run: async ({ discord, params }) => roleRequestResponse(discord, params, true)
};
