import { Message } from 'discord.js';

const imageMediaTypes = ['jpg', 'png', 'webp'];
let mediaTypes = [...imageMediaTypes, 'gif'];

/**
 * Gets the media in the given Discord message.
 *
 * @param {import('discord.js').Message} message
 * @param {string[]} mediaTypes
 * @param {string} errorMessage
 */
export function getMedia(message: Message, imageOnly?: boolean)
{
  if(imageOnly)
    mediaTypes = imageMediaTypes;

  /* If the message has a URL, check if it is a valid image type and get the URL. */
  const urlMatch = message.content.trim().toLowerCase().match(/\bhttps?:\/\/\S+/gi);
  if(urlMatch)
  {
    let [url] = urlMatch;
    const [beforeQueryPart] = url.split(/[#?]/);
    const extensionSplit = beforeQueryPart?.split('.');
    if(!extensionSplit)
      return;

    const urlExtension = extensionSplit.pop() || '';
    return mediaTypes.includes(urlExtension) ? url : undefined;
  }

  const { attachments } = message;
  const firstAttachment = attachments.first();
  if(!firstAttachment || attachments.size === 0)
    return;

  return firstAttachment.url;
}
