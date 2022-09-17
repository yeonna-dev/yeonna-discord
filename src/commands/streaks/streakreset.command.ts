import { updateStreak } from 'src/actions/updateStreak';
import { YeonnaCommand } from 'src/types';

export const streakreset: YeonnaCommand =
{
  name: 'streakreset',
  aliases: ['sreset'],
  run: ({ discord }) => updateStreak({ discord, reset: true }),
};
