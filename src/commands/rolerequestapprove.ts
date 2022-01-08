import { Command } from 'comtroller';
import { DiscordMessage } from '../utilities/discord';
import { roleRequestResponse } from '../actions/roleRequestResponse';

export const rolerequestapprove: Command =
{
  name: 'rolerequestapprove',
  aliases: ['rra'],
  run: async ({ message, params }: { message: DiscordMessage, params: string, }) =>
    roleRequestResponse(message, params, true)
};
