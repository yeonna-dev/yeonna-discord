import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';
import { GuildConfig } from 'src/types';
import { Core } from 'yeonna-core';

export async function getTop(discord: Discord, config: GuildConfig, isCollectibles?: boolean)
{
  const response = new CommandResponse(discord);

  discord.startTyping();

  const count = 10;
  const discordGuildId = discord.getGuildId();
  const top = await (isCollectibles
    ? Core.Obtainables.getTopCollectibles({ count, discordGuildId })
    : Core.Obtainables.getTopPoints({ count, discordGuildId })
  );

  if(!top || top.length === 0)
    return response.noTopUsers();

  const topAmounts: { userId: string, amount: number; }[] = [];
  for(const i in top)
  {
    const { discordId, amount } = top[i];
    if(!discordId)
      continue;

    topAmounts.push({
      userId: discordId,
      amount,
    });
  }

  let pointsName = config.pointsName || 'points';
  pointsName = pointsName.charAt(0).toUpperCase() + pointsName.substring(1);

  response.leaderboard(
    `Top ${topAmounts.length} ${isCollectibles ? 'Collectibles' : pointsName}`,
    topAmounts
  );
}
