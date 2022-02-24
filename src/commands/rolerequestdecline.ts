import { Command } from 'comtroller';
import { roleRequestResponse } from '../actions/roleRequestResponse';
import { noRolePermissions } from '../guards/discordMemberPermissions';

export const rolerequestdecline: Command =
{
  name: 'rolerequestdecline',
  aliases: ['rrd'],
  guards: [noRolePermissions],
  run: async ({ discord, params }) => roleRequestResponse(discord, params, false)
};
