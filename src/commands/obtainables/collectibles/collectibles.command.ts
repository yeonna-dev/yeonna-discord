import { Log } from 'src/libs/logger';
import { CollectiblesCommandResponse } from 'src/responses/collectibles';
import { YeonnaCommand } from 'src/types';
import { Core } from 'yeonna-core';

export const collectibles: YeonnaCommand =
{
  name: 'collectibles',
  aliases: ['cs'],
  run: async ({ discord, config }) =>
  {
    const response = new CollectiblesCommandResponse(discord, config);

    if(!discord.getGuildId())
      return response.guildOnly();

    discord.startTyping();
    try
    {
      const authorId = discord.getAuthorId();
      const collectibles = await Core.Obtainables.getCollectibles({
        userIdentifier: authorId,
        discordGuildId: discord.getGuildId(),
      });

      response.show(collectibles, authorId);
    }
    catch(error)
    {
      Log.error(error);
      response.cannotGet();
    }
  },
};
