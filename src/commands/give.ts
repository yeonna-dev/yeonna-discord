import { Command, parseParamsToArray } from 'comtroller';

import { transferUserPoints, NotEnoughPoints } from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

import { getIdFromMention } from '../helpers/getIdFromMention';
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
    let [user, amountString] = parseParamsToArray(params);
    if(!user)
      return message.channel.send('Transfer points to who?');

    /* Check if the given value is a valid number. */
    if(isNumber(amountString))
      return message.channel.send('Please include the amount.');

    message.channel.startTyping();

    /* Check if the receiver is a valid guild member. */
    user = getIdFromMention(user);
    const member = await message.guild.getMember(user);
    if(!member)
      return message.channel.send('User is not a member of this server.');

    /* Transfer points. */
    const amount = parseFloat(amountString);
    try
    {
      await transferUserPoints({
        fromUserIdentifier: message.author.id,
        toUserIdentifier: user,
        amount,
        discordGuildID: message.guild.id,
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
