import { Command } from 'comtroller';
import { updateStreak } from 'src/actions/updateStreak';

export const streakreset: Command =
{
  name: 'streakreset',
  aliases: ['sreset'],
  run: ({ discord }) => updateStreak({ discord, reset: true }),
};
