import { Core } from 'yeonna-core';
import { Config } from 'yeonna-config';
import { Client } from 'discord.js';
import schedule from 'node-schedule';

import { Discord } from '../libs/discord';
import { Log } from '../libs/logger';

export class RewardMostCollectibles
{
  private static client: Client;

  static async start(client: Client)
  {
    this.client = client;

    const date = new Date();
    date.setUTCHours(12);

    const recurrence = { hour: date.getHours(), minute: 0, dayOfWeek: 0 };
    schedule.scheduleJob(recurrence, () =>
    {
      try
      {
        this.run();
      }
      catch(error: any)
      {
        Log.error(error);
      }
    });
  }

  static async run(client?: Client)
  {
    if(client)
      this.client = client;

    const config = await Config.all();
    const discordGuildIds = [];
    const topCollectiblesPromises = [];
    const guildsToReward = [];
    for(const discordGuildId in config)
    {
      if(discordGuildId === 'global')
        continue;

      discordGuildIds.push(discordGuildId);

      const discordGuildConfig = config[discordGuildId];
      let mostCollectibles = discordGuildConfig.mostCollectiblesReward;
      if(!mostCollectibles)
        mostCollectibles = config.global.mostCollectiblesReward;

      if(!mostCollectibles) continue;

      guildsToReward.push(discordGuildId);
      topCollectiblesPromises.push(Core.Users.getTopCollectibles({
        count: mostCollectibles.prizes.length,
        discordGuildId,
      }));
    }

    const topCollectibles = await Promise.all(topCollectiblesPromises);

    const updateUserPointsPromises: any = [];
    const messages: any = [];
    for(const i in topCollectibles)
    {
      const discordGuildId = guildsToReward[i];
      const discordGuild = config[discordGuildId];
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
        updateUserPointsPromises.push(Core.Users.updatePoints({
          userIdentifier: discordId,
          discordGuildId,
          amount: reward,
          add: true,
        }));

        winnersText.push(`${Number(i) + 1}. <@${discordId}> = ${reward}`);
      }

      // TODO: Update message
      if(winners.length > 0)
        messages.push({ channelId, mesesage: `Winners\n${winnersText.join('\n')}` });
    }

    if(updateUserPointsPromises.length > 0)
      await Promise.all(updateUserPointsPromises);

    for(const { channelId, mesesage } of messages)
    {
      try
      {
        const channel = await this.client.channels.fetch(channelId);
        if(channel && channel.type === 'GUILD_TEXT')
          channel.send(mesesage);
      }
      catch(error)
      {
        Log.error(error);
      }
    }
  }
};
