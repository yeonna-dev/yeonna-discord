import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { Core } from 'yeonna-core';

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

      if(!collections || collections.length === 0)
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
