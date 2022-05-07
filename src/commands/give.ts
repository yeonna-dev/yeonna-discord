import { Command, parseParamsToArray } from 'comtroller';
import { Core, NotEnoughPoints } from 'yeonna-core';
import { isNumber } from '../helpers/isNumber';
import { Discord } from '../libs/discord';
import { Log } from '../libs/logger';

// TODO: Update responses
export const give: Command =
{
  name: 'give',
  aliases: ['pay'],
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    /* Get the receiver user and amount. */
    let [toUserIdentifier, amountString] = parseParamsToArray(params);
    if(!toUserIdentifier)
      return discord.send('Transfer points to who?');

    /* Check if the given value is a valid number. */
    if(isNumber(amountString))
      return discord.send('Please include the amount.');

    discord.startTyping();

    const discordGuildId = discord.getGuildId();
    const authorId = discord.getAuthorId();

    try
    {
      /* Check if the receiver is a valid guild member. */
      const memberId = await discord.getGuildMemberId(toUserIdentifier);
      if(!memberId)
        return discord.send('User is not a member of this server.');

      toUserIdentifier = memberId;
    }
    catch(error)
    {
      return Log.error(error);
    }

    /* Check if the receiver is the giver. */
    if(toUserIdentifier === authorId)
      return discord.send('You cannot give points to yourself.');

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

      const memberDisplayName = await discord.getGuildMemberDisplayName();
      discord.send(`Transferred ${amount} points to ${memberDisplayName}.`);
    }
    catch(error: any)
    {
      if(error instanceof NotEnoughPoints)
        discord.send('Not enough points.');
      else
      {
        Log.error(error);
        discord.send('Could not transfer points.');
      }
    }
  },
};
