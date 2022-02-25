import { Command, parseParamsToArray } from 'comtroller';
import { Config } from 'yeonna-config';
import { Core } from 'yeonna-core';

import { cooldowns, checkCooldownInGuild } from '../cooldowns';
import { getTimeLeft } from '../helpers/getTimeLeft';

import { Discord } from '../utilities/discord';
import { Log } from '../utilities/logger';

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

    const cooldown = await checkCooldownInGuild(name, discordGuildId, userIdentifier);
    if(cooldown)
      return discord.send(`Please wait ${getTimeLeft(cooldown)}.`);

    let [optionIdentifier] = parseParamsToArray(params);
    if(!optionIdentifier)
      return discord.send('Please choose an animal.');

    optionIdentifier = optionIdentifier.toLowerCase();

    const pickedOption = options.find(({ code, name }) =>
      code === optionIdentifier || name.toLowerCase() === optionIdentifier);
    if(!pickedOption)
      return discord.send('You cannot choose that animal.');

    const reward = pickedOption.reward || wheelSpinConfig.reward;
    if(!reward)
      return;

    const sentMessage = await discord.send(`You chose **${pickedOption.name}**.`
      + ' Spinning... <a:wheel:857186381583220756>');

    await new Promise(resolve => setTimeout(resolve, 4000));

    const winningOption = options[Math.floor(Math.random() * options.length)];
    const won = pickedOption.code === winningOption.code;
    if(won)
    {
      try
      {
        await Core.Users.updatePoints({
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

    await sentMessage.edit(`The wheel stopped at **${winningOption.name}**.`
      + ` You ${won ? `win __**${reward}**__ points!` : 'lose.'}`);
  },
};
