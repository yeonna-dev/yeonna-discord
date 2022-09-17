import { getUserParameter } from 'src/actions/getUserParameter';
import { checkCooldownInGuild, cooldowns } from 'src/cooldowns';
import { Log } from 'src/libs/logger';
import { CollectiblesCommandResponse } from 'src/responses/collectibles';
import { YeonnaCommand } from 'src/types';
import { Core, NotEnoughCollectibles } from 'yeonna-core';

const collectibleGetName = 'collectible-get';
const collectibleGiveName = 'collectible-give';

/* Add 1 hour cooldown for getting collectibles. */
cooldowns.add(collectibleGetName, 3600000, true);

/* Add 1 minute cooldown for giving collectibles. */
cooldowns.add(collectibleGiveName, 60000, true);

export const collectible: YeonnaCommand =
{
  name: 'collectible',
  aliases: ['c'],
  run: async ({ discord, params, config }) =>
  {
    const response = new CollectiblesCommandResponse(discord, config);

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

      response.received(receiverId);
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
