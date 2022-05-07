import { Command } from 'comtroller';
import { Core } from 'yeonna-core';
import { checkCooldownInGuild, cooldowns } from '../cooldowns';
import { getTimeLeft } from '../helpers/getTimeLeft';
import { Discord } from '../libs/discord';
import { Log } from '../libs/logger';

const name = 'search';

/* Add 25 second cooldown. */
cooldowns.add(name, 25000);

export const search: Command =
{
  name,
  aliases: ['s'],
  run: async ({ discord }: { discord: Discord, }) =>
  {
    const userIdentifier = discord.getAuthorId();
    const discordGuildId = discord.getGuildId();
    if(!discordGuildId)
      return;

    const cooldown = await checkCooldownInGuild(name, discordGuildId, userIdentifier);
    if(cooldown)
      return discord.send(`Please wait ${getTimeLeft(cooldown)}.`);

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
      return discord.send('Oops. Something went wrong. Please try again.');
    }

    // TODO: Update message
    discord.send(item
      ? `Found **${item.name}**!`
      : 'You found nothing. Keep searching!'
    );

    if(!item)
      return;

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
    const collectionNames = [];
    let totalBonus = 0;
    for(const collection of collections)
    {
      if(!collection.name || !collection.fixedBonus)
        continue;

      collectionNames.push(collection.name);
      totalBonus += collection.fixedBonus || 0;
    }

    await Core.Obtainables.updatePoints({
      userIdentifier,
      amount: totalBonus,
      discordGuildId,
      add: true,
    });

    let completedCollectionsMessage = collectionNames.length === 1
      ? `You have completed the **${collectionNames.pop()} collection**!`
      : (
        `You have completed ${collectionNames.length} collections!\n`
        + collectionNames.map(name => `• **${name}**`).join('\n')
      );

    // TODO: Update message
    // TODO: Update points name
    discord.send(
      'Congratulations!'
      + `\n\n${completedCollectionsMessage}`
      + `\n\nYou earn a bonus of __**${totalBonus} points**__!`
    );
  },
};
