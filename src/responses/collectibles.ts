import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export class CollectibleCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  claim = () => this.discord.replyEmbed({
    title: 'You claimed 1 collectible.',
  });

  show = (collectibleCount?: number, memberDisplayName?: string | null) =>
    this.discord.replyEmbed({
      title: memberDisplayName
        ? `${memberDisplayName} has ${collectibleCount || 0} collectibles.`
        : `${collectibleCount || 0} collectibles.`,
    });

  received = (receiverName?: string | null) => this.discord.replyEmbed({
    title: `${receiverName || 'User has'} received 1 collectible.`,
  });

  topUsers = (topCollectibles: { user: string, amount: number; }[]) =>
    this.leaderboard(`Top ${topCollectibles.length} Collectibles`, topCollectibles);

  cannotGet = () => this.discord.replyEmbed({
    title: 'Cannot get collectibles',
  });

  notEnough = () => this.discord.replyEmbed({
    title: 'Not enough collectibles.',
  });

  cannotTransfer = () => this.discord.replyEmbed({
    title: 'Could not transfer collectible.',
  });

  noTopUsers = () => this.discord.replyEmbed({
    title: 'No top users.',
  });
}