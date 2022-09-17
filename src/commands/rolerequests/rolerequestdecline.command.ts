import { roleRequestResponse } from 'src/actions/roleRequestResponse';
import { noRolePermissions } from 'src/guards/discordMemberPermissions';
import { YeonnaCommand } from 'src/types';

export const rolerequestdecline: YeonnaCommand =
{
  name: 'rolerequestdecline',
  aliases: ['rrd'],
  guards: [noRolePermissions],
  run: async ({ discord, params }) => roleRequestResponse(discord, params, false)
};
