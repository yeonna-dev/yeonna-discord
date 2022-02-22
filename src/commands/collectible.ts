import { Command, parseParamsToArray } from 'comtroller';

import { Core, NotEnoughCollectibles } from 'yeonna-core';

import { DiscordMessage } from '../utilities/discord';
import { Log } from '../utilities/logger';

import { checkCooldownInGuild, cooldowns } from '../cooldowns';

import { getGuildMember } from '../actions/getGuildMember';
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
    const { guild, author, mentions, member, channel } = message;
    if(!guild || !guild.id)
      return;

    const userIdentifier = author.id;
    const discordGuildId = guild.id;

    let mentionedMember = mentions.members.first();
    let [receiverId] = parseParamsToArray(params);

    const toGet = !mentionedMember && !receiverId;
    const cooldown = await checkCooldownInGuild(
      `collectible-${toGet ? 'get' : 'give'}`,
      discordGuildId,
      userIdentifier,
    );
    if(cooldown)
      return channel.send(`Please wait ${getTimeLeft(cooldown)}.`);

    if(toGet)
    {
      channel.startTyping();

      /* Claim collectible. */
      await Core.Users.updateUserCollectibles({
        userIdentifier,
        amount: 1,
        add: true,
        discordGuildId,
      });

      return channel.send(`${member.displayName} claimed 1 collectible.`);
    }

    channel.startTyping();

    if(!mentionedMember)
    {
      const receiverMember = await getGuildMember(message, receiverId);
      if(!receiverMember)
        return;

      mentionedMember = receiverMember;
    }

    try
    {
      /* Give collectible. */
      await Core.Users.transferUserCollectibles({
        fromUserIdentifier: userIdentifier,
        toUserIdentifier: mentionedMember.id,
        amount: 1,
        discordGuildId,
      });
      channel.send(`${mentionedMember.displayName} received 1 collectible.`);
    }
    catch(error: any)
    {
      if(error instanceof NotEnoughCollectibles)
        channel.send('Not enough collectibles.');
      else
      {
        Log.error(error);
        channel.send('Could not transfer collectible.');
      }
    }
  },
};
