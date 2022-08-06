import { Command, parseParamsToArray } from 'comtroller';
import { isNumber } from 'src/helpers/isNumber';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { PointsCommandResponse } from 'src/responses/points';
import { Core, NotEnoughPoints } from 'yeonna-core';

export const give: Command =
{
  name: 'give',
  aliases: ['pay'],
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    const response = new PointsCommandResponse(discord);

    /* Get the receiver user and amount. */
    let [toUserIdentifier, amountString] = parseParamsToArray(params);
    if(!toUserIdentifier)
      return response.noReceiver();

    /* Check if the given value is a valid number. */
    if(isNumber(amountString))
      return response.noAmount();

    discord.startTyping();

    const discordGuildId = discord.getGuildId();
    const authorId = discord.getAuthorId();

    try
    {
      /* Check if the receiver is a valid guild member. */
      const memberId = await discord.getGuildMemberId(toUserIdentifier);
      if(!memberId)
        return response.notMember();

      toUserIdentifier = memberId;
    }
    catch(error)
    {
      return Log.error(error);
    }

    /* Check if the receiver is the giver. */
    if(toUserIdentifier === authorId)
      return response.cannotGiveSelf();

    /* Transfer points. */
    const amount = parseFloat(amountString);
    try
    {
      await Core.Obtainables.transferUserPoints({
        fromUserIdentifier: authorId,
        toUserIdentifier,
        amount,
        discordGuildId,
      });

      response.transferred(amount, toUserIdentifier);
    }
    catch(error: any)
    {
      if(error instanceof NotEnoughPoints)
        response.notEnough();
      else
      {
        Log.error(error);
        response.couldNotTransfer();
      }
    }
  },
};
