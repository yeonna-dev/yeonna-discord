import { Message } from 'discord.js';
import { Command, parseParamsToArray } from 'comtroller';
import { getUserInventory } from '../actions/getUserInventory';

export const sell: Command =
{
  name: 'sell',
  run: async ({ message, params }: { message: Message, params: string }) =>
  {
    message.channel.startTyping();

    const items = await getUserInventory(message);
    if(! items)
      return;

    if(items.length === 0)
      return message.channel.send('You do not have items.');

    const itemsToSell = params
      .trim()
      .replace(/\s\s+/g, ' ')
      .replace(/\s*,\s*/g, ',')
      .split(',');

    message.channel.send(itemsToSell);
    message.channel.stopTyping(true);
  },
};

