import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export class BitCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  saved = () => this.discord.replyEmbed({
    title: 'Saved bit.',
  });

  noContent = () => this.discord.replyEmbed({
    title: 'Please add content to the bit.',
  });

  alreadySaved = () => this.discord.replyEmbed({
    title: 'You already saved that bit.',
  });

  couldNotSave = () => this.discord.replyEmbed({
    title: 'Could not save bit.',
  });

  cannotFind = () => this.discord.replyEmbed({
    title: 'Cannot find bits.',
  });

  noneFound = () => this.discord.replyEmbed({
    title: 'No bits found.',
  });
}
