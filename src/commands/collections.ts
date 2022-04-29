import { Command } from 'comtroller';
import { Core } from 'yeonna-core';

import { Discord } from '../libs/discord';
import { Log } from '../libs/logger';

// TODO: Update response
export const collections: Command =
{
  name: 'collections',
  aliases: ['cols'],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    discord.startTyping();
    try
    {
      const collections = await Core.Items.getUserCollections({
        userIdentifier: discord.getAuthorId(),
        discordGuildId: discord.getGuildId(),
      });

      if(collections.length === 0)
        return discord.send('You have not completed any collections yet.');

      let collectionNames = [];
      for(const { name } of collections)
      {
        if(!name)
          continue;

        collectionNames.push(`- **${name}**`);
      }

      discord.send(`Completed collections:\n\n${collectionNames.join('\n')}`);
    }
    catch(error)
    {
      Log.error(error);
      discord.send('Cannot get your collections. Please try again.');
    }
  },
};
