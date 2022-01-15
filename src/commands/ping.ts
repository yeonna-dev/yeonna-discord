import { Command } from 'comtroller';

import { DiscordMessage } from '../utilities/discord';

import { createDiscordEmbed } from '../helpers/createEmbed';

export const ping: Command =
{
  name: 'ping',
  run: ({ message }: { message: DiscordMessage; }) =>
  {
    const response = createDiscordEmbed({ title: `${~~(message.client.ping)} ms` });
    message.channel.send({ embeds: [response] });
  },
};
