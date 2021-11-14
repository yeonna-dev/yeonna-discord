import { Command } from 'comtroller';

import { getTop } from '../actions/getTop';
import { DiscordMessage } from '../utilities/discord';

export const collectiblestop: Command =
{
  name: 'collectiblestop',
  aliases: ['ctop'],
  run: ({ message }: { message: DiscordMessage; }) => getTop(message, true),
};