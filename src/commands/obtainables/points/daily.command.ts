import { Command } from 'comtroller';
import { updatePoints } from 'src/actions/updatePoints';
import { checkCooldownInGuild, cooldowns } from 'src/cooldowns';
import { PointsCommandResponse } from 'src/responses/points';
import { CommandParameters } from 'src/types';

const command = 'daily';

/* Add 24-hour cooldown. */
cooldowns.add(command, 86400000, true);

export const daily: Command =
{
  name: command,
  aliases: ['d'],
  run: async ({ discord, params, config }: CommandParameters) =>
  {
    const response = new PointsCommandResponse(discord, config);

    const authorId = discord.getAuthorId();
    const guildId = discord.getGuildId();
    if(!guildId)
      return;

    const cooldown = await checkCooldownInGuild(command, guildId, authorId);
    if(cooldown)
      return response.onCooldown(cooldown);

    const rng = Math.floor((Math.random() * 100) + 1);
    const [min, max] = (
      rng <= 5 ? [601, 700] :
        rng <= 20 ? [401, 600] : [200, 400]
    );

    const daily = Math.floor(Math.random() * (max - min)) + min;
    await updatePoints({ discord, params, config, daily });
  },
};
