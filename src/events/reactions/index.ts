import
{
  Client,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
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
  client.on('messageReactionAdd', (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) =>
  {
    for(const { emote, handler } of handlers)
    {
      if(reaction.emoji.name === emote)
      {
        handler(reaction, user);
        break;
      }
    }
  });
}
