import { Command } from 'comtroller';
import { updateStreak } from '../actions/updateStreak';

export const streakset: Command =
{
  name: 'streakset',
  aliases: ['sset'],
  run: ({ discord, params }) => updateStreak({ discord, params }),
};
