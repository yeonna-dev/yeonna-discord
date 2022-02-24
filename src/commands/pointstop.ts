import { Command } from 'comtroller';

import { Discord } from '../utilities/discord';

import { getTop } from '../actions/getTop';

export const pointstop: Command =
{
  name: 'pointstop',
  aliases: ['ptop'],
  run: ({ discord }: { discord: Discord, }) => getTop(discord),
};
