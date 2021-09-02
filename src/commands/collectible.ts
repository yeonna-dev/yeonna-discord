import { GuildMember, Message } from 'discord.js';
import { Command, parseParamsToArray } from 'comtroller';

import
{
  NotEnoughCollectibles,
  transferUserCollectibles,
  updateUserCollectibles,
} from 'yeonna-core';

import { cooldowns } from '../cooldowns/cooldowns-instance';
import { findDiscordUser } from '../actions/findDiscordUser';
import { getIdFromMention } from '../helpers/getIdFromMention';
import { getTimeLeft } from '../helpers/getTimeLeft';
import { Log } from '../utilities/logger';

/* Add 1 hour cooldown for getting collectibles. */
cooldowns.add('collectible-get', 3600000, true);

/* Add 1 minute cooldown for giving collectibles. */
cooldowns.add('collectible-give', 60000, true);

// TODO: Update responses
export const collectible: Command =
{
  name: 'collectible',
  aliases: [ 'c' ],
  run: async ({ message, params }: { message: Message, params: string }) =>
  {
    const userIdentifier = message.author.id;
    const discordGuildID = message.guild?.id;

    let mentionedMember = message.mentions.members?.first();
    let [ receiverID ] = parseParamsToArray(params);

    const toGet = ! mentionedMember && ! receiverID;
    const cooldown = await cooldowns.check(`collectible-${toGet ? 'get' : 'give'}`, userIdentifier);
    if(cooldown)
      return message.channel.send(`Please wait ${getTimeLeft(cooldown)}.`);

    if(toGet)
    {
      message.channel.startTyping();

      /* Claim collectible. */
      await updateUserCollectibles({
        userIdentifier,
        amount: 1,
        add: true,
        discordGuildID,
      });

      message.channel.send(`${message.member?.displayName} claimed 1 collectible.`);
      message.channel.stopTyping(true);
      return;
    }

    message.channel.startTyping();

    if(! mentionedMember)
    {
      receiverID = getIdFromMention(receiverID);
      const receiverMember = await findDiscordUser(message, receiverID, true);
      if(! receiverMember || ! (receiverMember instanceof GuildMember))
        return message.channel.send('User is not a member of this server.');

      mentionedMember = receiverMember;
    }

    try
    {
      /* Give collectible. */
      await transferUserCollectibles({
        fromUserIdentifier: userIdentifier,
        toUserIdentifier: mentionedMember.id,
        amount: 1,
        discordGuildID,
      });
      message.channel.send(`${mentionedMember.displayName} received 1 collectible.`);
    }
    catch(error)
    {
      if(error instanceof NotEnoughCollectibles)
        message.channel.send('Not enough collectibles.');
      else
      {
        Log.error(error);
        message.channel.send('Could not transfer collectible.');
      }
    }
    finally
    {
      message.channel.stopTyping(true);
    }
  },
};
