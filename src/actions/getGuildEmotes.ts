import { Message } from 'discord.js';

import { Log } from '../utilities/logger';

export async function getGuildEmotes(message: Message)
{
  const guild = message.guild;
  if(!guild)
    return;

  const { emojis } = guild;
  let existingEmotes;
  try
  {
    existingEmotes = await emojis.fetch();
  }
  catch(error: any)
  {
    Log.error(error);
    existingEmotes = emojis.cache;
  }

  return existingEmotes;
}