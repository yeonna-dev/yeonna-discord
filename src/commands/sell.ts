import { Command } from 'comtroller';

import { Discord } from '../utilities/discord';
import { Log } from '../utilities/logger';

export const sell: Command =
{
  name: 'sell',
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    discord.send('soon™️');
    // message.channel.startTyping();

    // let items;
    // try
    // {
    //   items = await getUserInventory(message);
    //   if(!items || items.length === 0)
    //     return message.channel.send('You do not have items.');
    // }
    // catch(error: any)
    // {
    //   Log.error(error);
    // }

    // if(!items)
    //   return message.channel.send('Cannot sell items');

    // const itemsToSell = params
    //   .trim()
    //   .replace(/\s\s+/g, ' ')
    //   .replace(/\s*,\s*/g, ',')
    //   .split(',')
    //   .join('\n');

    // message.channel.send(itemsToSell);
  },
};

