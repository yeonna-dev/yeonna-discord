import { Client } from 'discord.js';
import schedule from 'node-schedule';
import { Log } from 'src/libs/logger';
import { Config } from 'yeonna-config';
import { Core } from 'yeonna-core';

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
      topCollectiblesPromises.push(Core.Obtainables.getTopCollectibles({
        count: mostCollectibles.prizes.length,
        discordGuildId,
      }));
    }

    const topCollectibles = await Promise.all(topCollectiblesPromises);
    if(!topCollectibles)
      return;

    /* Create the promises that will update the points of the winners,
      which will be executed in parallel. */
    const updateUserPointsPromises: Promise<unknown>[] = [];
    const resetCollectiblesPromises: Promise<unknown>[] = [];
    const messages: { channelId: string, message: string, }[] = [];
    for(const i in topCollectibles)
    {
      const discordGuildId = guildsToReward[i];
      const discordGuild = config[discordGuildId];
      const settings = discordGuild.mostCollectiblesReward;
      if(!settings)
        continue;

      const channelId = settings.channel;
      const prizes = settings.prizes;
      if(!channelId || !prizes)
        continue;

      const winners = topCollectibles[i];
      if(!winners)
        continue;

      const winnersText = [];
      for(const i in winners)
      {
        const index = Number(i);
        const { discordId } = winners[index];
        if(!discordId)
          continue;

        const reward = prizes[index];
        updateUserPointsPromises.push(Core.Obtainables.updatePoints({
          userIdentifier: discordId,
          discordGuildId,
          amount: reward,
          add: true,
        }));

        winnersText.push(`${Number(i) + 1}. <@${discordId}> = ${reward}`);
      }

      if(winners.length > 0)
        messages.push({
          channelId,
          message: `**Collectible Leaderboard Winners**\n\n${winnersText.join('\n')}`,
        });

      /* Reset the collectibles of all users in each guild. */
      resetCollectiblesPromises.push(Core.Obtainables.resetCollectibles({
        discordGuildId,
      }));
    }


    if(updateUserPointsPromises.length > 0)
      await Promise.all([
        ...updateUserPointsPromises,
        ...resetCollectiblesPromises,
      ]);

    for(const { channelId, message } of messages)
    {
      try
      {
        const channel = await this.client.channels.fetch(channelId);
        if(channel && channel.type === 'GUILD_TEXT')
          channel.send(message);
      }
      catch(error)
      {
        Log.error(error);
      }
    }
  }
};
