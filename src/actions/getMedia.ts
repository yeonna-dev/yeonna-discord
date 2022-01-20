import { Message } from 'discord.js';

const mediaTypes = ['jpg', 'png', 'gif', 'webp'];

/**
 * Gets the media in the given Discord message.
 *
 * @param {import('discord.js').Message} message
 * @param {string[]} mediaTypes
 * @param {string} errorMessage
 */
export function getMedia(
  message: Message,
  errorMessage: string = 'Please add an image link or attachment or try again.',
)
{
  function respondError()
  {
    message.channel.send(errorMessage);
  }

  /* If the message has a URL, check if it is a valid image type and get the URL. */
  const urlMatch = message.content.trim().toLowerCase().match(/\bhttps?:\/\/\S+/gi);
  if(urlMatch)
  {
    let [url] = urlMatch;
    const [beforeQueryPart] = url.split(/[#?]/);
    const extensionSplit = beforeQueryPart?.split('.');
    if(!extensionSplit)
      return respondError();

    const urlExtension = extensionSplit.pop() || '';
    return mediaTypes.includes(urlExtension) ? url : respondError();
  }

  const { attachments } = message;
  const firstAttachment = attachments.first();
  if(!firstAttachment || attachments.size === 0)
    return respondError();

  return firstAttachment.url;
}
