import { Command, parseParamsToArray } from 'comtroller';

import
{
  NotEnoughCollectibles,
  transferUserCollectibles,
  updateUserCollectibles,
} from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

import { cooldowns } from '../cooldowns/cooldowns-instance';

import { getIdFromMention } from '../helpers/getIdFromMention';
import { getTimeLeft } from '../helpers/getTimeLeft';

/* Add 1 hour cooldown for getting collectibles. */
cooldowns.add('collectible-get', 3600000, true);

/* Add 1 minute cooldown for giving collectibles. */
cooldowns.add('collectible-give', 60000, true);

// TODO: Update responses
export const collectible: Command =
{
  name: 'collectible',
  aliases: ['c'],
  run: async ({ message, params }: { message: DiscordMessage, params: string; }) =>
  {
    const userIdentifier = message.author.id;
    const discordGuildId = message.guild?.id;

    let mentionedMember = message.mentions.members.first();
    let [receiverId] = parseParamsToArray(params);

    const toGet = !mentionedMember && !receiverId;
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
        discordGuildId,
      });

      return message.channel.send(`${message.member.displayName} claimed 1 collectible.`);
    }

    message.channel.startTyping();

    if(!mentionedMember)
    {
      receiverId = getIdFromMention(receiverId);
      const receiverMember = await message.guild.getMember(receiverId);
      if(!receiverMember)
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
        discordGuildId,
      });
      message.channel.send(`${mentionedMember.displayName} received 1 collectible.`);
    }
    catch(error: any)
    {
      if(error instanceof NotEnoughCollectibles)
        message.channel.send('Not enough collectibles.');
      else
      {
        Log.error(error);
        message.channel.send('Could not transfer collectible.');
      }
    }
  },
};
