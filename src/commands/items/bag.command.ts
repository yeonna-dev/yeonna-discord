import { Log } from 'src/libs/logger';
import { ItemsCommandResponse } from 'src/responses/items';
import { YeonnaCommand } from 'src/types';
import { Core } from 'yeonna-core';

export const bag: YeonnaCommand =
{
  name: 'bag',
  aliases: ['b', 'items'],
  run: async ({ discord }) =>
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
