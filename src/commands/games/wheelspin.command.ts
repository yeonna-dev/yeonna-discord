import { Command, parseParamsToArray } from 'comtroller';
import { checkCooldownInGuild, cooldowns } from 'src/cooldowns';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { GameCommandResponse } from 'src/responses/games';
import { Config } from 'yeonna-config';
import { Core } from 'yeonna-core';

const name = 'wheelspin';

/* Add 60 second cooldown. */
cooldowns.add(name, 60000);

// TODO: Update messages
export const wheelspin: Command =
{
  name,
  aliases: ['ws'],
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    const response = new GameCommandResponse(discord);

    const userIdentifier = discord.getAuthorId();
    const discordGuildId = discord.getGuildId();
    if(!discordGuildId)
      return;

    let guildConfig;
    try
    {
      guildConfig = await Config.ofGuild(discordGuildId);
    }
    catch(error)
    {
      Log.error(error);
    }

    const wheelSpinConfig = guildConfig?.miniGames?.wheelSpin;
    const options = wheelSpinConfig?.choices;
    if(!wheelSpinConfig || !options)
      return;

    let [optionIdentifier] = parseParamsToArray(params);
    if(!optionIdentifier)
      return response.wheelSpinNotValidOption();

    const cooldown = await checkCooldownInGuild(name, discordGuildId, userIdentifier);
    if(cooldown)
      return response.onCooldown(cooldown);

    optionIdentifier = optionIdentifier.toLowerCase();

    const pickedOption = options.find(({ code, name }) =>
      code === optionIdentifier || name.toLowerCase() === optionIdentifier);
    if(!pickedOption)
      return response.wheelSpinNotValidOption();

    const reward = pickedOption.reward || wheelSpinConfig.reward;
    if(!reward)
      return;

    const sentMessage = await response.wheelSpinSpinning(pickedOption.name);

    /* Wait 4 seconds */
    await new Promise(resolve => setTimeout(resolve, 4000));

    const winningOption = options[Math.floor(Math.random() * options.length)];
    const won = pickedOption.code === winningOption.code;
    if(won)
    {
      try
      {
        await Core.Obtainables.updatePoints({
          userIdentifier,
          discordGuildId,
          amount: reward,
          add: true,
        });
      }
      catch(error: any)
      {
        Log.error(error);
      }
    }

    response.wheelSpinResult(sentMessage, winningOption.name, won, reward);
  },
};
