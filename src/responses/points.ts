import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export class PointsCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  // TODO: pass discord user IDs
  updatedUserPoints = ({
    isAdded,
    amount,
    user,
  }: {
    isAdded: boolean,
    amount: number,
    user?: string,
  }) => this.discord.replyEmbed({
    description: isAdded
      ? `Added ${amount} points to ${user || 'that user'}.`
      : `Set points of ${user || 'that user'} to ${amount}`
  });

  transferred = (amount: number, user: string) => this.discord.replyEmbed({
    title: `Transferred ${amount} points to ${user || 'that user'}.`
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

  cannotGiveSelf = () => this.discord.replyEmbed({
    title: 'You cannot give points to yourself.',
  });

  couldNotAdd = () => this.discord.replyEmbed({
    title: 'Could not add points.',
  });
}
