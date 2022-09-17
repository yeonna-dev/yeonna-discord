import { updateStreak } from 'src/actions/updateStreak';
import { YeonnaCommand } from 'src/types';

export const streakup: YeonnaCommand =
{
  name: 'streakup',
  aliases: ['sup'],
  run: ({ discord }) => updateStreak({ discord, increment: true }),
};
