import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { ItemsCommandResponse } from 'src/responses/items';
import { Core } from 'yeonna-core';

export const collections: Command =
{
  name: 'collections',
  aliases: ['cols'],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    const response = new ItemsCommandResponse(discord);

    discord.startTyping();
    try
    {
      const collections = await Core.Items.getUserCollections({
        userIdentifier: discord.getAuthorId(),
        discordGuildId: discord.getGuildId(),
      });

      if(!collections || collections.length === 0)
        return response.noCollections();

      response.collections(collections);
    }
    catch(error)
    {
      Log.error(error);
      response.cannotGetCollections();
    }
  },
};
