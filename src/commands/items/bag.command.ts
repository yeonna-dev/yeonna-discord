import { Log } from 'src/libs/logger';
import { ItemsCommandResponse } from 'src/responses/items';
import { YeonnaCommand } from 'src/types';
import { Core } from 'yeonna-core';

export const bag: YeonnaCommand =
{
  name: 'bag',
  aliases: ['b', 'items'],
  run: async ({ discord, config }) =>
  {
    const response = new ItemsCommandResponse(discord, config);

    discord.startTyping();

    const userIdentifier = discord.getAuthorId();
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

    try
    {
      await response.items(items, userIdentifier);
    }
    catch(error)
    {
      Log.error(error);
    }
  },
};
