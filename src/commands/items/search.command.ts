import { checkCooldownInGuild, cooldowns } from 'src/cooldowns';
import { Log } from 'src/libs/logger';
import { ItemsCommandResponse } from 'src/responses/items';
import { YeonnaCommand } from 'src/types';
import { Core } from 'yeonna-core';

const name = 'search';

/* Add 25 second cooldown. */
cooldowns.add(name, 25000);

export const search: YeonnaCommand =
{
  name,
  aliases: ['s'],
  run: async ({ discord, config }) =>
  {
    const response = new ItemsCommandResponse(discord, config);

    const userIdentifier = discord.getAuthorId();
    const discordGuildId = discord.getGuildId();
    if(!discordGuildId)
      return;

    const cooldown = await checkCooldownInGuild(name, discordGuildId, userIdentifier);
    if(cooldown)
      return response.onCooldown(cooldown);

    discord.startTyping();

    /* Obtain the random item. */
    let item;
    try
    {
      item = await Core.Items.obtainRandomItem({ userIdentifier, discordGuildId });
    }
    catch(error)
    {
      Log.error(error);
      return response.cannotSearch();
    }

    if(item)
      response.foundItem(item);
    else
      return response.foundNothing();

    /* Check for any completed collections. */
    let collections;
    try
    {
      collections = await Core.Items.checkForCollections({ userIdentifier, discordGuildId });
    }
    catch(error)
    {
      Log.error(error);
    }

    if(!collections || collections.length === 0)
      return;

    /* If there are any completed collections, reward the user the collection's bonus. */
    const completedCollections = [];
    let totalBonus = 0;
    for(const collection of collections)
    {
      if(!collection.name || !collection.fixedBonus)
        continue;

      completedCollections.push(collection);
      totalBonus += collection.fixedBonus || 0;
    }

    await Core.Obtainables.updatePoints({
      userIdentifier,
      amount: totalBonus,
      discordGuildId,
      add: true,
    });

    response.completedCollections(completedCollections, totalBonus);
  },
};
