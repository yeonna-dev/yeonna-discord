import { parseParamsToArray } from 'comtroller';

import { Core } from 'yeonna-core';

import { getGuildMember } from './getGuildMember';
import { isNumber } from '../helpers/isNumber';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

// TODO: Update responses
export async function updatePoints({
  message,
  params,
  daily,
  add,
}: {
  message: DiscordMessage,
  params: string,
  daily?: number,
  add?: boolean;
})
{
  if(!message.guild)
    return message.channel.send('This command can only be used in a guild.');

  let
    user: string,
    amount: number;

  if(daily)
  {
    user = message.author.id;
    amount = daily;
    add = true;
  }
  else
  {
    const [userString, amountString] = parseParamsToArray(params);
    if(!userString)
      return message.channel.send(add
        ? 'Add points to who?'
        : 'Set points of who?'
      );

    /* Check if the given value is a valid number. */
    if(isNumber(amountString))
      return message.channel.send('Please include the amount.');

    user = userString;
    amount = parseFloat(amountString);
  }

  const member = await getGuildMember(message, user);
  if(!member)
    return;

  message.channel.startTyping();

  try
  {
    await Core.Users.updateUserPoints({ userIdentifier: member.id, amount, discordGuildId: message.guild.id, add });
    message.channel.send(add
      ? `Added ${amount} points to ${member.displayName}.`
      : `Set points of ${member.displayName} to ${amount}`
    );
  }
  catch(error: any)
  {
    Log.error(error);
    message.channel.send('Could not add points.');
  }
}
