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

  guildOnly = () => this.discord.replyEmbed({
    title: 'This command can only be used in a guild.',
  });

  notMember = () => this.discord.replyEmbed({
    title: 'User is not a member of this server.',
  });

  leaderboard = (title: string, topData: { userId: string, amount: number; }[]) =>
    this.discord.replyEmbed({
      title,
      description: topData
        .map(({ amount, userId }, i) =>
          `${i + 1}.  **${amount}** - ${this.discord.userMention(userId)}`)
        .join('\n')
    });

  noTopUsers = () => this.discord.replyEmbed({
    title: 'No top users.',
  });
};
