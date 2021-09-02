import { Message } from 'discord.js';
import { Command } from 'comtroller';

import { getTop } from '../actions/getTop';

export const collectiblestop: Command =
{
  name: 'collectiblestop',
  aliases: [ 'ctop' ],
  run: ({ message }: { message: Message }) => getTop(message, true),
};