import { Command } from 'comtroller';
import { DiscordMessage } from '../utilities/discord';
import { roleRequestResponse } from '../actions/roleRequestResponse';

export const rolerequestdecline: Command =
{
  name: 'rolerequestdecline',
  aliases: ['rrd'],
  run: async ({ message, params }: { message: DiscordMessage, params: string, }) =>
    roleRequestResponse(message, params, false)
};
