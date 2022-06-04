import { Command } from 'comtroller';
import { roleRequestResponse } from 'src/actions/roleRequestResponse';
import { noRolePermissions } from 'src/guards/discordMemberPermissions';

export const rolerequestapprove: Command =
{
  name: 'rolerequestapprove',
  aliases: ['rra'],
  guards: [noRolePermissions],
  run: async ({ discord, params }) => roleRequestResponse(discord, params, true)
};
