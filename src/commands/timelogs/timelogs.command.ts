import { Command } from 'comtroller';
import { getTimeLogsByDate } from 'src/actions/getTimeLogsByDate';
import { Discord } from 'src/libs/discord';

export const timelogs: Command =
{
  name: 'timelogs',
  aliases: ['tl'],
  run: ({ discord }: { discord: Discord; }) => getTimeLogsByDate(discord)
};
