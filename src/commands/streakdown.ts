import { Command } from 'comtroller';
import { updateStreak } from '../actions/updateStreak';

export const streakdown: Command =
{
  name: 'streakdown',
  aliases: ['sdown'],
  run: ({ discord }) => updateStreak({ discord, decrement: true }),
};
