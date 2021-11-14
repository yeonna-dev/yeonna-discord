import { Command } from 'comtroller';

import { getTop } from '../actions/getTop';

import { DiscordMessage } from '../utilities/discord';

export const pointstop: Command =
{
  name: 'pointstop',
  aliases: ['ptop'],
  run: ({ message }: { message: DiscordMessage; }) => getTop(message),
};
