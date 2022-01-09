import schedule from 'node-schedule';
import { Core } from 'yeonna-core';

import { Config } from '../utilities/config';
import { Discord } from '../utilities/discord';
import { Log } from '../utilities/logger';

export const rewardMostCollectibles = new class
{
  private discord!: Discord;

  async start(discord: Discord)
  {
    this.discord = discord;

    const date = new Date();
    date.setUTCHours(12);
    const recurrence = { hour: date.getHours(), minute: 0, dayOfWeek: 0 };
    schedule.scheduleJob(recurrence, () =>
    {
      try
      {
        this.job();
      }
      catch(error: any)
      {
        Log.error(error);
      }
    });
  }

  private async job()
  {
    const config = await Config.get();
    const discordGuilds = config.guilds;
    const discordGuildIds = [];
    const topCollectiblesPromises = [];
    for(const discordGuildId in discordGuilds)
    {
      discordGuildIds.push(discordGuildId);

      const discordGuild = discordGuilds[discordGuildId];
      const mostCollectibles = discordGuild.mostCollectiblesReward;
      if(!mostCollectibles) continue;
      topCollectiblesPromises.push(Core.Users.getTopCollectibles({
        count: mostCollectibles.prizes.length,
        discordGuildId,
      }));
    }

    const topCollectibles = await Promise.all(topCollectiblesPromises);

    const updateUserPointsPromises = [];
    const messages = [];
    for(const i in topCollectibles)
    {
      const discordGuildId = discordGuildIds[i];
      const discordGuild = discordGuilds[discordGuildId];
      const settings = discordGuild.mostCollectiblesReward;
      if(!settings) continue;

      const channelId = settings.channel;
      const prizes = settings.prizes;
      if(!channelId || !prizes) continue;

      const winners = topCollectibles[i];
      const winnersText = [];
      for(const i in winners)
      {
        const { discordId } = winners[i];
        if(!discordId) continue;

        const reward = prizes[i];
        updateUserPointsPromises.push(Core.Users.updateUserPoints({
          userIdentifier: discordId,
          discordGuildId,
          amount: reward,
          add: true,
        }));

        winnersText.push(`${Number(i) + 1}. <@${discordId}> = ${reward}`);
      }

      // TODO: Update message
      messages.push({ channelID: channelId, mesesage: `Winners\n${winnersText.join('\n')}` });
    }

    await Promise.all(updateUserPointsPromises);

    for(const { channelID, mesesage } of messages)
      this.discord.sendMessageInChannel(channelID, mesesage);
  }
};
