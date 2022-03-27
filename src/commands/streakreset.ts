import { Command } from 'comtroller';
import { updateStreak } from '../actions/updateStreak';

export const streakreset: Command =
{
  name: 'streakreset',
  aliases: ['sreset'],
  run: ({ discord }) => updateStreak({ discord, reset: true }),
};
