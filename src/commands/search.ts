import { Command } from 'comtroller';
import { Core } from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';

import { cooldowns } from '../cooldowns/cooldowns-instance';

import { getTimeLeft } from '../helpers/getTimeLeft';
import { Log } from '../utilities/logger';

const name = 'search';

/* Add 25 second cooldown. */
cooldowns.add(name, 25000);

export const search: Command =
{
  name,
  aliases: ['s'],
  run: async ({ message }: { message: DiscordMessage; }) =>
  {
    const cooldown = await cooldowns.check(name, message.author.id);
    if(cooldown)
      return message.channel.send(`Please wait ${getTimeLeft(cooldown)}.`);

    if(!message.guild)
      return;

    message.channel.startTyping();

    const userIdentifier = message.author.id;
    const discordGuildId = message.guild.id;

    /* Obtain the random item. */
    let item;
    try
    {
      item = await Core.Items.obtainRandomItem({ userIdentifier, discordGuildId });
    }
    catch(error)
    {
      Log.error(error);
      return message.channel.send('Oops. Something went wrong. Please try again.');
    }

    // TODO: Update message
    message.channel.send(item
      ? `Found **${item.name}**!`
      : 'Found trash.'
    );

    if(!item)
      return;

    /* Check for any completed collections. */
    let collections;
    try
    {
      collections = await Core.Items.checkForCollection({ userIdentifier, discordGuildId });
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

    await Core.Users.updateUserPoints({
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
    message.channel.send(
      'Congratulations!'
      + `\n\n${completedCollectionsMessage}`
      + `\n\nYou earn a bonus of __**${totalBonus} points**__!`
    );
  },
};
