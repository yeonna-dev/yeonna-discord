import { Command, parseParamsToArray } from 'comtroller';
import { getUserPoints } from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

import { getIdFromMention } from '../helpers/getIdFromMention';

// TODO: Update message
export const points: Command =
{
  name: 'points',
  aliases: ['p'],
  run: async ({ message, params }: { message: DiscordMessage, params: string; }) =>
  {
    if(!message.guild)
      return message.channel.send('This command can only be used in a guild.');

    let [userIdentifier] = parseParamsToArray(params);
    userIdentifier = userIdentifier || message.author.id;
    userIdentifier = getIdFromMention(userIdentifier);

    message.channel.startTyping();

    try
    {
      const points = await getUserPoints({ userIdentifier, discordGuildId: message.guild.id });
      message.channel.send(points?.toString() || '0');
    }
    catch(error: any)
    {
      Log.error(error);
      message.channel.send('0');
    }
  },
};
