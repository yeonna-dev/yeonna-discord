import { parseParamsToArray } from 'comtroller';
import { Core } from 'yeonna-core';
import { isNumber } from '../helpers/isNumber';
import { Discord } from '../libs/discord';
import { Log } from '../libs/logger';

// TODO: Update responses
export async function updatePoints({
  discord,
  params,
  daily,
  add,
}: {
  discord: Discord,
  params: string,
  daily?: number,
  add?: boolean;
})
{
  let
    user: string,
    amount: number;

  if(daily)
  {
    user = discord.getAuthorId();
    amount = daily;
    add = true;
  }
  else
  {
    const [userString, amountString] = parseParamsToArray(params);
    if(!userString)
      return discord.send(add ? 'Add points to who?' : 'Set points of who?');

    /* Check if the given value is a valid number. */
    if(isNumber(amountString))
      return discord.send('Please include the amount.');

    user = userString;
    amount = parseFloat(amountString);
  }

  const discordGuildId = discord.getGuildId();
  let mentionedMemberId;
  let mentionedMemberDisplayName;
  try
  {
    const member = await discord.fetchGuildMember(user);
    if(!member)
      return;

    mentionedMemberId = member.id;
    mentionedMemberDisplayName = member.displayName;
  }
  catch(error)
  {
    Log.error(error);
  }

  if(!mentionedMemberId || !discordGuildId)
    return;

  discord.startTyping();

  try
  {
    await Core.Obtainables.updatePoints({
      userIdentifier: mentionedMemberId,
      amount,
      discordGuildId,
      add,
    });

    const response = add
      ? `Added ${amount} points to ${mentionedMemberDisplayName}.`
      : `Set points of ${mentionedMemberDisplayName} to ${amount}`;

    discord.send(response);
  }
  catch(error)
  {
    Log.error(error);
    discord.send('Could not add points.');
  }
}
