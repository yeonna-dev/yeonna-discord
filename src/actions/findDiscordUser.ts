import { Message } from 'discord.js';
import { Log } from '../utilities/logger';

export async function findDiscordUser(message: Message, userDiscordID: string, asMember?: boolean)
{
  /* Try to fetch the user as a guild member. */
  let user;
  try
  {
    user = await message.guild?.members.fetch(userDiscordID);
  }
  catch(error)
  {
    /* Error code `10013` is when the given user is an unknown user. */
    /* Error code `10007` is when the user is not a member of the server. */
    if(error.code !== 10013 && error.code !== 10007)
      Log.error(error);
  }

  if(asMember)
    return user;

  /* Try to fetch the user as a Discord user. */
  try
  {
    user = await message.client.users.fetch(userDiscordID);
  }
  catch(error)
  {
    if(error.code !== 10013)
      Log.error(error);
  }

  return user;
}
