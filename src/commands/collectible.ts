import { Command, parseParamsToArray } from 'comtroller';

import { Core, NotEnoughCollectibles } from 'yeonna-core';

import { Discord } from '../utilities/discord';
import { Log } from '../utilities/logger';

import { checkCooldownInGuild, cooldowns } from '../cooldowns';

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
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    const userIdentifier = discord.getAuthorId();
    const discordGuildId = discord.getGuildId() as string;

    let mentionedMemberId = discord.getMentionedMemberId();
    let [receiverId] = parseParamsToArray(params);
    const toGet = !mentionedMemberId && !receiverId;

    const cooldown = await checkCooldownInGuild(
      `collectible-${toGet ? 'get' : 'give'}`,
      discordGuildId,
      userIdentifier,
    );
    if(cooldown)
      return discord.send(`Please wait ${getTimeLeft(cooldown)}.`);

    discord.startTyping();

    if(toGet)
    {
      /* Claim collectible. */
      await Core.Users.updateCollectibles({
        userIdentifier,
        discordGuildId,
        amount: 1,
        add: true,
      });

      const memberDisplayName = await discord.getGuildMemberDisplayName();
      return discord.send(`${memberDisplayName} claimed 1 collectible.`);
    }

    if(!mentionedMemberId)
    {
      let receiverMember;
      try
      {
        receiverMember = await discord.getGuildMemberId(receiverId);
      }
      catch(error)
      {
        Log.error(error);
      }

      if(!receiverMember)
        return;

      mentionedMemberId = receiverMember;
    }

    try
    {
      /* Give collectible. */
      await Core.Users.transferUserCollectibles({
        fromUserIdentifier: userIdentifier,
        toUserIdentifier: mentionedMemberId,
        amount: 1,
        discordGuildId,
      });

      const receiverDisplayName = discord.getMentionedMemberDisplayName();
      discord.send(`${receiverDisplayName} received 1 collectible.`);
    }
    catch(error)
    {
      if(error instanceof NotEnoughCollectibles)
        discord.send('Not enough collectibles.');
      else
      {
        Log.error(error);
        discord.send('Could not transfer collectible.');
      }
    }
  },
};
