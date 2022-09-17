import { updateStreak } from 'src/actions/updateStreak';
import { YeonnaCommand } from 'src/types';

export const streakset: YeonnaCommand =
{
  name: 'streakset',
  aliases: ['sset'],
  run: ({ discord, params }) => updateStreak({ discord, params }),
};
