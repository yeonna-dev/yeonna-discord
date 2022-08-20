import { getTimeLeft } from 'src/helpers/getTimeLeft';
import { Discord } from 'src/libs/discord';

export class CommandResponse
{
  protected discord: Discord;

  constructor(discord: Discord)
  {
    this.discord = discord;
  }

  ping = (pingInMs: number) => this.discord.replyEmbed({
    title: `${~~pingInMs} ms`
  });

  onCooldown = (cooldown: number | boolean) => this.discord.replyEmbed({
    title: `Please wait ${getTimeLeft(cooldown)}.`
  });

  guildOnly = () => this.discord.replyEmbed({
    title: 'This command can only be used in a guild.',
  });

  noChannelMention = () => this.discord.replyEmbed({
    title: 'Please mention a channel.',
  });

  inSameChannel = () => this.discord.replyEmbed({
    title: 'Cannot be the same channel.',
  });

  notTextChannel = () => this.discord.replyEmbed({
    title: 'The channel is not a text channel.',
  });

  cannotSendMessages = () => this.discord.replyEmbed({
    title: 'Cannot send messages in that channel.',
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

  error = () => this.discord.replyEmbed({
    title: 'Oops. Something went wrong. Please try again.'
  });
};
