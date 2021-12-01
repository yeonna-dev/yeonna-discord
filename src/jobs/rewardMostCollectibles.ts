import schedule from 'node-schedule';
import { getTopCollectibles, updateUserPoints } from 'yeonna-core';

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
    const discordGuilds = config.servers;
    const discordGuildIDs = [];
    const topCollectiblesPromises = [];
    for(const discordGuildID in discordGuilds)
    {
      discordGuildIDs.push(discordGuildID);

      const discordGuild = discordGuilds[discordGuildID];
      const mostCollectibles = discordGuild.mostCollectiblesReward;
      if(!mostCollectibles) continue;
      topCollectiblesPromises.push(getTopCollectibles({
        count: mostCollectibles.prizes.length,
        discordGuildID,
      }));
    }

    const topCollectibles = await Promise.all(topCollectiblesPromises);

    const updateUserPointsPromises = [];
    const messages = [];
    for(const i in topCollectibles)
    {
      const discordGuildID = discordGuildIDs[i];
      const discordGuild = discordGuilds[discordGuildID];
      const settings = discordGuild.mostCollectiblesReward;
      if(!settings) continue;

      const channelID = settings.channel;
      const prizes = settings.prizes;
      if(!channelID || !prizes) continue;

      const winners = topCollectibles[i];
      const winnersText = [];
      for(const i in winners)
      {
        const { discordID } = winners[i];
        if(!discordID) continue;

        const reward = prizes[i];
        updateUserPointsPromises.push(updateUserPoints({
          userIdentifier: discordID,
          discordGuildID: discordGuildID,
          amount: reward,
          add: true,
        }));

        winnersText.push(`${Number(i) + 1}. <@${discordID}> = ${reward}`);
      }

      // TODO: Update message
      messages.push({ channelID, mesesage: `Winners\n${winnersText.join('\n')}` });
    }

    await Promise.all(updateUserPointsPromises);

    for(const { channelID, mesesage } of messages)
      this.discord.sendMessageInChannel(channelID, mesesage);
  }
};
