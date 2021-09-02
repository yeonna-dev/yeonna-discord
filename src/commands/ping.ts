import { Message } from 'discord.js';
import { Command } from 'comtroller';
import { createEmbed } from '../helpers/createEmbed';

export const ping: Command =
{
  name: 'ping',
  run: ({ message }: { message: Message }) =>
  {
    const response = createEmbed(`${~~(message.client.ws.ping)} ms`);
    message.channel.send(response);
  },
};
