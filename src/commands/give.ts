import { Command, parseParamsToArray } from 'comtroller';

import { Core, NotEnoughPoints } from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

import { getGuildMember } from '../helpers/getGuildMember';
import { isNumber } from '../helpers/isNumber';

// TODO: Update responses
export const give: Command =
{
  name: 'give',
  aliases: ['pay'],
  run: async ({ message, params }: { message: DiscordMessage, params: string; }) =>
  {
    if(!message.guild)
      return message.channel.send('This command can only be used in a guild.');

    /* Get the receiver user and amount. */
    let [toUserIdentifier, amountString] = parseParamsToArray(params);
    if(!toUserIdentifier)
      return message.channel.send('Transfer points to who?');

    /* Check if the given value is a valid number. */
    if(isNumber(amountString))
      return message.channel.send('Please include the amount.');

    message.channel.startTyping();

    /* Check if the receiver is a valid guild member. */
    const member = await getGuildMember(message, toUserIdentifier);
    if(!member)
      return;

    toUserIdentifier = member.id;

    /* Check if the receiver is the giver. */
    if(toUserIdentifier === message.author.id)
      return message.channel.send('You cannot give points to yourself.');

    /* Transfer points. */
    const amount = parseFloat(amountString);
    try
    {
      await Core.Users.transferUserPoints({
        fromUserIdentifier: message.author.id,
        toUserIdentifier,
        amount,
        discordGuildId: message.guild.id,
      });

      message.channel.send(`Transferred ${amount} points to ${member.displayName}.`);
    }
    catch(error: any)
    {
      if(error instanceof NotEnoughPoints)
        message.channel.send('Not enough points.');
      else
      {
        Log.error(error);
        message.channel.send('Could not transfer points.');
      }
    }
  },
};
