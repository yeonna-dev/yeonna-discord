import { Message } from 'discord.js';

import { getUserItems } from 'yeonna-core';

import { Log } from '../utilities/logger';

/* Returns `undefined` when there was an error caught and an empty array when there are no items. */
export async function getUserInventory(message: Message)
{
  if(! message.guild)
    return;

  try
  {
    return getUserItems({
      userIdentifier: message.author.id,
      discordGuildID: message.guild.id,
    });
  }
  catch(error)
  {
    Log.error(error);
    message.channel.send('Cannot get user items.');
  }
}
