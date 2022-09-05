import { Command } from 'comtroller';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { ItemsCommandResponse } from 'src/responses/items';
import { Core } from 'yeonna-core';

export const bag: Command =
{
  name: 'bag',
  aliases: ['b', 'items'],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    const response = new ItemsCommandResponse(discord);

    discord.startTyping();

    let items;
    try
    {
      items = await Core.Items.getUserItems({
        userIdentifier: discord.getAuthorId(),
        discordGuildId: discord.getGuildId(),
      });
    }
    catch(error)
    {
      Log.error(error);
      return response.cannotGetItems();
    }

    if(!items || !items.length)
      return response.noItems();

    response.items(items);
  },
};
