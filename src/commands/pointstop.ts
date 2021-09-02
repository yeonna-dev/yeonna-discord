import { Message } from 'discord.js';
import { Command } from 'comtroller';

import { getTop } from '../actions/getTop';

export const pointstop: Command =
{
  name: 'pointstop',
  aliases: [ 'ptop' ],
  run: ({ message }: { message: Message }) => getTop(message),
};
