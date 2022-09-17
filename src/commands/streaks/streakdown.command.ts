import { updateStreak } from 'src/actions/updateStreak';
import { YeonnaCommand } from 'src/types';

export const streakdown: YeonnaCommand =
{
  name: 'streakdown',
  aliases: ['sdown'],
  run: ({ discord }) => updateStreak({ discord, decrement: true }),
};
