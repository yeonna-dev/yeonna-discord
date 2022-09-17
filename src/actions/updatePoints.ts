import { parseParamsToArray } from 'comtroller';
import { isNumber } from 'src/helpers/isNumber';
import { Log } from 'src/libs/logger';
import { PointsCommandResponse } from 'src/responses/points';
import { CommandParameters } from 'src/types';
import { Core } from 'yeonna-core';

export async function updatePoints({
  discord,
  params,
  config,
  daily,
  add = false,
}: CommandParameters & {
  daily?: number,
  add?: boolean;
})
{
  const response = new PointsCommandResponse(discord, config);

  let user: string;
  let amount: number;

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
      return response.noUserToUpdate(add);

    /* Check if the given value is a valid number. */
    if(isNumber(amountString))
      return response.noAmount();

    user = userString;
    amount = parseFloat(amountString);
  }

  const discordGuildId = discord.getGuildId();
  let mentionedMemberId;
  try
  {
    const member = await discord.fetchGuildMember(user);
    if(!member)
      return;

    mentionedMemberId = member.id;
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

    response.updatedUserPoints({
      isAdded: add,
      amount,
      userId: mentionedMemberId,
    });
  }
  catch(error)
  {
    Log.error(error);
    response.couldNotAdd();
  }
}
