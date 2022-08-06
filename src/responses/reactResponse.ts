import { AnyChannel } from 'discord.js';
import { Discord } from 'src/libs/discord';
import { CommandResponse } from 'src/responses/common';

export class ReactRepostCommandResponse extends CommandResponse
{
  constructor(discord: Discord)
  {
    super(discord);
  }

  reactRepostChannelChanged = (channelMention: AnyChannel) => this.discord.replyEmbed({
    description: `Set the react reposts approval channel to ${channelMention}`
  });

  reactRepostChannelCannotSet = () => this.discord.replyEmbed({
    title: 'Could not set the channel for react reposts.',
  });
}
