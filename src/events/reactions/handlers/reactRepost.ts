import { MessageReaction, PartialMessageReaction, TextChannel } from 'discord.js';
import { Config } from 'yeonna-config';

import { Log } from '../../../utilities/logger';

const reactRepostWebhookName = 'Yeonna - React Repost';

/* This feature uses webhooks to repost messages in the guild's react repost channel. */
export async function reactRepost(reaction: MessageReaction | PartialMessageReaction)
{
  const guildId = reaction.message.guildId;
  if(!guildId)
    return;

  let reactRepostConfig;
  try
  {
    const { reactRepost } = await Config.ofGuild(guildId);
    reactRepostConfig = reactRepost;
  }
  catch(error)
  {
    Log.error(error);
  }

  if(!reactRepostConfig)
    return;

  let reactCount;
  try
  {
    const react = await reaction.fetch();
    reactCount = react.count;
  }
  catch(error: any)
  {
    Log.error(error);
  }

  if(!reactCount || reactCount !== reactRepostConfig.count)
    return;

  const reactRepostChannel = reactRepostConfig.channel;
  if(!reactRepostChannel)
    return;

  let repostWebhook;
  try
  {
    const repostChannel = await reaction.client.channels.fetch(reactRepostChannel) as TextChannel;
    if(!repostChannel?.isText())
      return;

    /* Get the react repost webhook for the react repost channel.
      If the webhook is not yet created, it is created for the channel. */
    const webhooksCollection = await repostChannel.fetchWebhooks();
    repostWebhook = webhooksCollection.find(webhook => webhook.name === reactRepostWebhookName);
    if(!repostWebhook)
      repostWebhook = await repostChannel.createWebhook(reactRepostWebhookName, {
        avatar: reaction.client.user?.displayAvatarURL(),
      });
  }
  catch(error: any)
  {
    Log.error(error);
  }

  const { content, member, attachments } = reaction.message;
  if(!repostWebhook || !member)
    return;

  const attachmentFiles = [];
  for(const { url } of attachments.toJSON())
    attachmentFiles.push(url);

  try
  {
    await repostWebhook.send({
      content: content || undefined,
      username: `${member.displayName}`,
      avatarURL: member.displayAvatarURL(),
      files: attachmentFiles
    });
  }
  catch(error)
  {
    Log.error(error);
  }
}
