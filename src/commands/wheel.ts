import { Command, parseParamsToArray } from 'comtroller';
import { Core } from 'yeonna-core';

import { cooldowns, checkCooldownInGuild } from '../cooldowns';
import { getTimeLeft } from '../helpers/getTimeLeft';

import { Discord } from '../utilities/discord';
import { Log } from '../utilities/logger';

// TODO: Create per-server configurable data
const reward = 350;
const animals = [
  { code: 'rb', name: 'Rabbit' },
  { code: 'dr', name: 'Dragon' },
  { code: 'pi', name: 'Pig' },
  { code: 'sq', name: 'Squirrel' },
  { code: 'uc', name: 'Unicorn' },
  { code: 'pg', name: 'Penguin' },
  { code: 'eg', name: 'Eagle' },
  { code: 'tg', name: 'Tiger' },
  { code: 'dg', name: 'Dog' },
];

const name = 'wheel';

/* Add 60 second cooldown. */
cooldowns.add(name, 60000);

// TODO: Update messages
export const wheel: Command =
{
  name,
  aliases: ['w'],
  run: async ({ discord, params }: { discord: Discord, params: string, }) =>
  {
    const userIdentifier = discord.getAuthorId();
    const discordGuildId = discord.getGuildId();
    if(!discordGuildId)
      return;

    const cooldown = await checkCooldownInGuild(name, discordGuildId, userIdentifier);
    if(cooldown)
      return discord.send(`Please wait ${getTimeLeft(cooldown)}.`);

    let [pickedAnimal] = parseParamsToArray(params);
    if(!pickedAnimal)
      return discord.send('Please choose an animal.');

    pickedAnimal = pickedAnimal.toLowerCase();

    const animal = animals.find(({ code, name }) =>
      code === pickedAnimal || name.toLowerCase() === pickedAnimal);

    if(!animal)
      return discord.send('You cannot choose that animal.');

    const sentMessage = await discord.send(`You chose **${animal.name}**.`
      + ' Spinning... <a:wheel:857186381583220756>');

    await new Promise(resolve => setTimeout(resolve, 4000));

    const chosenAnimal = animals[Math.floor(Math.random() * animals.length)];
    const won = animal.code === chosenAnimal.code;
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

    await sentMessage.edit(`The wheel stopped at **${chosenAnimal.name}**.`
      + ` You ${won ? `win __**${reward}**__ points!` : 'lose.'}`);
  },
};
