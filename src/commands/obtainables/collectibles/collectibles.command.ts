import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { CollectiblesCommandResponse } from 'src/responses/collectibles';
import { Core } from 'yeonna-core';

export const collectibles: Command =
{
  name: 'collectibles',
  aliases: ['cs'],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    const response = new CollectiblesCommandResponse(discord);

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
