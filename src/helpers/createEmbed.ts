import { MessageEmbed } from 'discord.js';

export function createEmbed(title: string, description?: string): MessageEmbed
{
  const embed = new MessageEmbed()
    .setTitle(title);

  if(description)
    embed.setDescription(description);

  return embed;
}
