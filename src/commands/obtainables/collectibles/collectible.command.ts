import { Command } from 'comtroller';
import { getUserParameter } from 'src/actions/getUserParameter';
import { checkCooldownInGuild, cooldowns } from 'src/cooldowns';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { CollectibleCommandResponse } from 'src/responses/collectibles';
import { Core, NotEnoughCollectibles } from 'yeonna-core';

const collectibleGetName = 'collectible-get';
const collectibleGiveName = 'collectible-give';

/* Add 1 hour cooldown for getting collectibles. */
cooldowns.add(collectibleGetName, 3600000, true);

/* Add 1 minute cooldown for giving collectibles. */
cooldowns.add(collectibleGiveName, 60000, true);

export const collectible: Command =
{
  name: 'collectible',
  aliases: ['c'],
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    const response = new CollectibleCommandResponse(discord);

    const userIdentifier = discord.getAuthorId();
    const discordGuildId = discord.getGuildId() as string;

    discord.startTyping();

    let receiverId;
    try
    {
      receiverId = await getUserParameter({ discord, params });
    }
    catch(error)
    {
      Log.error(error);
      return response.cannotTransfer();
    }

    if(!receiverId)
    {
      const cooldown = await checkCooldownInGuild(
        collectibleGetName,
        discordGuildId,
        userIdentifier,
      );
      if(cooldown)
        return response.onCooldown(cooldown);

      /* Claim collectible. */
      await Core.Obtainables.updateCollectibles({
        userIdentifier,
        discordGuildId,
        amount: 1,
        add: true,
      });

      return response.claim();
    }

    try
    {
      const cooldown = await checkCooldownInGuild(
        collectibleGiveName,
        discordGuildId,
        userIdentifier,
      );
      if(cooldown)
        return response.onCooldown(cooldown);

      /* Give collectible. */
      await Core.Obtainables.transferUserCollectibles({
        fromUserIdentifier: userIdentifier,
        toUserIdentifier: receiverId,
        amount: 1,
        discordGuildId,
      });

      let receiverDisplayName = discord.getMentionedMemberDisplayName();
      if(!receiverDisplayName)
        receiverDisplayName = await discord.getGuildMemberDisplayName(receiverId);

      response.received(receiverDisplayName);
    }
    catch(error)
    {
      if(error instanceof NotEnoughCollectibles)
        response.notEnough();
      else
      {
        Log.error(error);
        response.cannotTransfer();
      }
    }
  },
};
