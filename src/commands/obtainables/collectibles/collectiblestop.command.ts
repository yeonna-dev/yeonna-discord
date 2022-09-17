import { getTop } from 'src/actions/getTop';
import { YeonnaCommand } from 'src/types';

export const collectiblestop: YeonnaCommand =
{
  name: 'collectiblestop',
  aliases: ['ctop'],
  run: ({ discord }) => getTop(discord, true),
};