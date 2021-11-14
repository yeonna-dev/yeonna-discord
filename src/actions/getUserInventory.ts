import { getUserItems } from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

/* Returns `undefined` when there was an error caught and an empty array when there are no items. */
export async function getUserInventory(message: DiscordMessage)
{
  if(!message.inGuild())
    return;

  try
  {
    return getUserItems({
      userIdentifier: message.author.id,
      discordGuildID: message.guild.id,
    });
  }
  catch(error: any)
  {
    Log.error(error);
    message.channel.send('Cannot get user items.');
  }
}
