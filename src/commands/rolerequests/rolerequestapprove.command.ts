import { roleRequestResponse } from 'src/actions/roleRequestResponse';
import { noRolePermissions } from 'src/guards/discordMemberPermissions';
import { YeonnaCommand } from 'src/types';

export const rolerequestapprove: YeonnaCommand =
{
  name: 'rolerequestapprove',
  aliases: ['rra'],
  guards: [noRolePermissions],
  run: async ({ discord, params }) => roleRequestResponse(discord, params, true)
};
