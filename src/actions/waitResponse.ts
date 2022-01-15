import { Message } from 'discord.js';

export async function waitResponse(message: Message, timeLimit: number)
{
  const response = await message.channel.awaitMessages({
    filter: ({ author }: Message) => author.id === message.author.id,
    max: 1,
    time: timeLimit
  });

  return response.first();
}
