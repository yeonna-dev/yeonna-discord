import { ColorResolvable, MessageEmbed } from 'discord.js';

export function createDiscordEmbed({
  title,
  description,
  color,
  author,
  timestamp,
  footer,
  image,
}: {
  title?: string;
  description?: string;
  color?: string;
  author?: {
    name: string;
    iconURL?: string;
    url?: string;
  };
  timestamp?: number | Date | null;
  footer?: {
    text: string;
    iconURL?: string;
  };
  image?: string;
}): MessageEmbed
{
  const embed = new MessageEmbed();

  if(title)
    embed.setTitle(title);

  if(description)
    embed.setDescription(description);

  if(color)
    embed.setColor(color as ColorResolvable);

  if(author)
    embed.setAuthor(author);

  if(timestamp)
    embed.setTimestamp(timestamp);

  if(footer)
    embed.setFooter(footer);

  if(image)
    embed.setImage(image);

  return embed;
}
