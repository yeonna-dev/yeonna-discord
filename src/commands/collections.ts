import { Command } from 'comtroller';
import { Core } from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

// TODO: Update response
export const collections: Command =
{
  name: 'collections',
  aliases: ['cols'],
  run: async ({ message }: { message: DiscordMessage; }) =>
  {
    const { guild, channel, author } = message;
    if(!guild)
      return channel.send('This command can only be used in a guild.');

    channel.startTyping();
    try
    {
      const collections = await Core.Items.getUserCollections({
        userIdentifier: author.id,
        discordGuildId: guild.id,
      });

      if(collections.length === 0)
        return channel.send('You have not completed any collections yet.');

      let collectionNames = [];
      for(const { name } of collections)
      {
        if(!name)
          continue;

        collectionNames.push(`- **${name}**`);
      }

      channel.send(`Completed collections:\n\n${collectionNames.join('\n')}`);
    }
    catch(error)
    {
      Log.error(error);
      channel.send('Cannot get your collections. Please try again.');
    }
  },
};
