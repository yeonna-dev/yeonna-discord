import { Command } from 'comtroller';
import { DiscordMessage } from '../utilities/discord';
import { roleRequestResponse } from '../actions/roleRequestResponse';
import { noRolePermissions } from '../guards/discordMemberPermissions';

export const rolerequestapprove: Command =
{
  name: 'rolerequestapprove',
  aliases: ['rra'],
  guards: [noRolePermissions],
  run: async ({ message, params }: { message: DiscordMessage, params: string, }) =>
    roleRequestResponse(message, params, true)
};
