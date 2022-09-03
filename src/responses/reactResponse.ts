import { AnyChannel } from 'discord.js';
import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export class ReactRepostCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  channelChanged = (channelMention: AnyChannel) => this.discord.replyEmbed({
    description: `Set the react reposts approval channel to ${channelMention}`
  });

  channelCannotSet = () => this.discord.replyEmbed({
    title: 'Could not set the channel for react reposts.',
  });
}
