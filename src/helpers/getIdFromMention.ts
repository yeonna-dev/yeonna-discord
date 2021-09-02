export function getIdFromMention(mention: string)
{
	if(mention.startsWith('<@') && mention.endsWith('>'))
  {
		mention = mention.slice(2, -1);

		if(mention.startsWith('!'))
			mention = mention.slice(1);

		if(mention.startsWith('&'))
			mention = mention.slice(1);
	}

  return mention;
}