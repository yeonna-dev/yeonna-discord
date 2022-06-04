import { Command } from 'comtroller';
import { getTop } from 'src/actions/getTop';
import { Discord } from 'src/libs/discord';

export const collectiblestop: Command =
{
  name: 'collectiblestop',
  aliases: ['ctop'],
  run: ({ discord }: { discord: Discord, }) => getTop(discord, true),
};