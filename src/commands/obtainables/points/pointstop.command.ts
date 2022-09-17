import { getTop } from 'src/actions/getTop';
import { YeonnaCommand } from 'src/types';

export const pointstop: YeonnaCommand =
{
  name: 'pointstop',
  aliases: ['ptop'],
  run: ({ discord, config }) => getTop(discord, config),
};
