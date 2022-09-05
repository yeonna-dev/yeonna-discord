import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export class PointsCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  // TODO: Maybe update
  show = (amount: number, userId?: string) => (
    userId
      ? this.discord.replyEmbed({
        description: `Points of ${this.discord.userMention(userId)}: **${amount}**`
      })
      : this.discord.replyEmbed({ title: `${amount.toString()} points` })
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
      ? `Added **${amount} points** to ${userId ? this.discord.userMention(userId) : 'that user'}.`
      : `Set points of ${userId ? this.discord.userMention(userId) : 'that user'} to ${amount}`
  });

  transferred = (amount: number, userId: string) => this.discord.replyEmbed({
    description: `Transferred **${amount} points** to`
      + ` ${userId ? this.discord.userMention(userId) : 'that user'}.`
  });

  noReceiver = () => this.discord.replyEmbed({
    title: 'Transfer points to who?',
  });

  noUserToUpdate = (toAdd: boolean) => this.discord.replyEmbed({
    title: toAdd ? 'Add points to who?' : 'Set points of who?',
  });

  noAmount = () => this.discord.replyEmbed({
    title: 'Please include the amount.',
  });

  notEnough = () => this.discord.replyEmbed({
    title: 'Not enough points.',
  });

  cannotGiveSelf = () => this.discord.replyEmbed({
    title: 'You cannot give points to yourself.',
  });

  couldNotAdd = () => this.discord.replyEmbed({
    title: 'Could not add points.',
  });

  couldNotTransfer = () => this.discord.replyEmbed({
    title: 'Could not transfer points.'
  });
}
