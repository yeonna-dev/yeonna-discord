import
{
  Client,
  MessageReaction,
  PartialMessageReaction,
} from 'discord.js';

import { reactRepost } from './handlers';

const handlers = [
  {
    name: 'reactRepost',
    emote: '🕰️',
    handler: reactRepost,
  },
];

export async function handleReactions(client: Client)
{
  client.on('messageReactionAdd', (reaction: MessageReaction | PartialMessageReaction) =>
  {
    for(const { emote, handler } of handlers)
    {
      if(reaction.emoji.name === emote)
      {
        handler(reaction);
        break;
      }
    }
  });
}
