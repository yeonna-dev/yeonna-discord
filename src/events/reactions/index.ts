import
{
  Client,
  MessageReaction,
  PartialMessageReaction
} from 'discord.js';
import { reactRepost } from './handlers';


const handlers = [
  {
    name: 'reactRepost',
    handler: reactRepost,
  },
];

export async function handleReactions(client: Client)
{
  client.on('messageReactionAdd', (reaction: MessageReaction | PartialMessageReaction) =>
  {
    for(const { handler } of handlers)
      handler(reaction);
  });
}
