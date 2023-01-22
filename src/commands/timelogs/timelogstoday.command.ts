import { Command } from 'comtroller';
import { getTimeLogsByDate } from 'src/actions/getTimeLogsByDate';
import { Discord } from 'src/libs/discord';

export const timelogstoday: Command =
{
  name: 'timelogstoday',
  aliases: ['tlt'],
  run: ({ discord }: { discord: Discord; }) => getTimeLogsByDate(discord, new Date()),
};
