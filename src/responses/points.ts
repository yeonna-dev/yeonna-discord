import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';
import { GuildConfig } from 'src/types';

export class PointsCommandResponse extends CommandResponse
{
  private pointsName: string;

  constructor(discord: Discord, config: GuildConfig)
  {
    super(discord);
    this.pointsName = config.pointsName;
  }

  show = (amount: number, userId?: string) => (
    userId
      ? this.discord.replyEmbed({
        description: `${this.pointsName} of ${this.discord.userMention(userId)}: **${amount}**`
      })
      : this.discord.replyEmbed({ title: `${amount.toString()} ${this.pointsName}` })
  );

  updatedUserPoints = ({
    isAdded,
    amount,
    userId,
  }: {
    isAdded: boolean,
    amount: number,
    userId?: string,
  }) => this.discord.replyEmbed({
    description: isAdded
      ? `Added **${amount}** ${this.pointsName} to ${userId ? this.discord.userMention(userId) : 'that user'}.`
      : `Set ${this.pointsName} of ${userId ? this.discord.userMention(userId) : 'that user'} to **${amount}**`
  });

  transferred = (amount: number, userId: string) => this.discord.replyEmbed({
    description: `Transferred **${amount} ${this.pointsName}** to`
      + ` ${userId ? this.discord.userMention(userId) : 'that user'}.`
  });

  noReceiver = () => this.discord.replyEmbed({
    title: `Transfer ${this.pointsName} to who?`,
  });

  noUserToUpdate = (toAdd: boolean) => this.discord.replyEmbed({
    title: toAdd ? `Add ${this.pointsName} to who?` : `Set ${this.pointsName} of who?`,
  });

  noAmount = () => this.discord.replyEmbed({
    title: 'Please include the amount.',
  });

  notEnough = () => this.discord.replyEmbed({
    title: `Not enough ${this.pointsName}.`,
  });

  cannotGiveSelf = () => this.discord.replyEmbed({
    title: `You cannot give ${this.pointsName} to yourself.`,
  });

  couldNotAdd = () => this.discord.replyEmbed({
    title: `Could not add ${this.pointsName}.`,
  });

  couldNotTransfer = () => this.discord.replyEmbed({
    title: `Could not transfer ${this.pointsName}.`
  });
}
