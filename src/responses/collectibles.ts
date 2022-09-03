import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export class CollectiblesCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  claim = () => this.discord.replyEmbed({
    title: 'You claimed 1 collectible.',
  });

  show = (collectibleCount?: number, userId?: string | null) =>
    this.discord.replyEmbed({
      description: `${userId ? this.discord.userMention(userId) : 'User'} has`
        + ` **${collectibleCount || 0} collectibles**.`,
    });

  received = (receiverId?: string | null) => this.discord.replyEmbed({
    description: (receiverId ? this.discord.userMention(receiverId) : 'User has')
      + ` received **1 collectible**.`,
  });

  cannotGet = () => this.discord.replyEmbed({
    title: 'Cannot get collectibles',
  });

  notEnough = () => this.discord.replyEmbed({
    title: 'Not enough collectibles.',
  });

  cannotTransfer = () => this.discord.replyEmbed({
    title: 'Could not transfer collectible.',
  });
}
