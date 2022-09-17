import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';
import { GuildConfig } from 'src/types';

export class CollectiblesCommandResponse extends CommandResponse
{
  private collectiblesName: string;

  constructor(discord: Discord, config: GuildConfig)
  {
    super(discord);
    this.collectiblesName = config.collectiblesName;
  }

  claim = () => this.discord.replyEmbed({
    title: `You claimed 1 ${this.collectiblesName}.`,
  });

  show = (collectibleCount?: number, userId?: string | null) =>
    this.discord.replyEmbed({
      description: `${userId ? this.discord.userMention(userId) : 'User'} has`
        + ` **${collectibleCount || 0} ${this.collectiblesName}**.`,
    });

  received = (receiverId?: string | null) => this.discord.replyEmbed({
    description: (receiverId ? this.discord.userMention(receiverId) : 'User has')
      + ` received **1 ${this.collectiblesName}**.`,
  });

  cannotGet = () => this.discord.replyEmbed({
    title: `Cannot get ${this.collectiblesName}`,
  });

  notEnough = () => this.discord.replyEmbed({
    title: `Not enough ${this.collectiblesName}.`,
  });

  cannotTransfer = () => this.discord.replyEmbed({
    title: `Could not transfer ${this.collectiblesName}.`,
  });
}
