import { Log } from 'src/libs/logger';
import { ItemsCommandResponse } from 'src/responses/items';
import { YeonnaCommand } from 'src/types';
import { Core } from 'yeonna-core';

export const collections: YeonnaCommand =
{
  name: 'collections',
  aliases: ['cols'],
  run: async ({ discord, config }) =>
  {
    const response = new ItemsCommandResponse(discord, config);

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
