import { Command } from 'comtroller';

import { getTop } from '../actions/getTop';

import { Discord } from '../utilities/discord';

export const collectiblestop: Command =
{
  name: 'collectiblestop',
  aliases: ['ctop'],
  run: ({ discord }: { discord: Discord, }) => getTop(discord, true),
};