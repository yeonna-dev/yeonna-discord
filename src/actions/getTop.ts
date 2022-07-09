import { Discord } from 'src/libs/discord';
import { CollectibleCommandResponse } from 'src/responses/collectibles';
import { Core } from 'yeonna-core';

export async function getTop(discord: Discord, collectibles?: boolean)
{
  const response = new CollectibleCommandResponse(discord);

  discord.startTyping();

  const count = 10;
  const discordGuildId = discord.getGuildId();
  const top = await (collectibles
    ? Core.Obtainables.getTopCollectibles({ count, discordGuildId })
    : Core.Obtainables.getTopPoints({ count, discordGuildId })
  );

  if(!top || top.length === 0)
    return response.noTopUsers();

  const topAmounts: { user: string, amount: number; }[] = [];
  for(const i in top)
  {
    const { discordId, amount } = top[i];
    if(!discordId)
      continue;

    topAmounts.push({
      user: `<@${discordId}>`,
      amount,
    });
  }

  if(collectibles)
    response.topUsers(topAmounts);
  else
    response.leaderboard('Points', topAmounts);
}
