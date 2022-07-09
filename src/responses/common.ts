import { getTimeLeft } from 'src/helpers/getTimeLeft';
import { Discord } from 'src/libs/discord';

export class CommandResponse
{
  protected discord: Discord;

  constructor(discord: Discord)
  {
    this.discord = discord;
  }

  onCooldown = (cooldown: number | boolean) => this.discord.replyEmbed({
    title: `Please wait ${getTimeLeft(cooldown)}.`
  });

  guildOnly = () => this.discord.reply('This command can only be used in a guild.');

  leaderboard = (title: string, topData: { user: string, amount: number; }[]) =>
    this.discord.replyEmbed({
      title,
      description: topData
        .map(({ amount, user }, i) => `${i + 1}.  **${amount}** - ${user}`)
        .join('\n')
    });
};
