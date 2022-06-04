import { Command } from 'comtroller';
import { updateStreak } from 'src/actions/updateStreak';

export const streakup: Command =
{
  name: 'streakup',
  aliases: ['sup'],
  run: ({ discord }) => updateStreak({ discord, increment: true }),
};
