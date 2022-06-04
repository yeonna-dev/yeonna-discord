import { Command } from 'comtroller';
import { getTop } from 'src/actions/getTop';
import { Discord } from 'src/libs/discord';

export const pointstop: Command =
{
  name: 'pointstop',
  aliases: ['ptop'],
  run: ({ discord }: { discord: Discord, }) => getTop(discord),
};
