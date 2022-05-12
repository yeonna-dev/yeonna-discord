import { MessageReaction, PartialMessageReaction, TextChannel } from 'discord.js';
import { Config } from 'yeonna-config';
import { Log } from '../../../libs/logger';


const reactRepostWebhookName = 'Yeonna - React Repost';

/* This feature uses webhooks to repost messages in the guild's react repost channel. */
export async function reactRepost(reaction: MessageReaction | PartialMessageReaction)
{
  const guildId = reaction.message.guildId;
  if(!guildId)
    return;

  /* Get the react repost config. */
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

  const { emote, count, channel, approval } = reactRepostConfig || {};
  const { emote: approvalEmote, approvers = [] } = approval || {};
  const reactionChannelId = reaction.message.channelId;

  /* Do nothing if there is no react repost emote, count or channel,
    or if the reaction is made in the react repost channel. */
  if(!emote || !count || !channel || reactionChannelId === channel)
    return;

  const reactionEmote = reaction.emoji.toString();
  if(![emote, approvalEmote].includes(reactionEmote))
    return;

  /* Get all the reactions of the message where a reaction was added. */
  let reactions;
  try
  {
    const message = await reaction.message.fetch();
    reactions = message.reactions.cache;
  }
  catch(error: any)
  {
    Log.error(error);
  }

  if(!reactions)
    return;

  /* Get the count of the reactions that have the emote as the react repost emote. */
  let countedReactionsCount = reactions
    .filter(({ emoji }) => emoji.toString() === emote).size;


  /* If the approval emote is the same as the react repost emote,
  deduct 1 to the counted reaction count. */
  if(approvalEmote === emote)
    countedReactionsCount--;

  /* Do nothing if the number of react repost emotes is less than the required count to repost. */
  if(countedReactionsCount < count)
    return;

  /* If the react repost requires approval, check if there has been
  at least one of the approval emote in the reactions. */
  const needsApproval = approvers.length !== 0 && !!approvalEmote;
  if(needsApproval)
  {
    const isApprovalEmote = reactionEmote === approvalEmote;
    const hasApprover = reaction.users.cache.some(({ id }) => approvers.includes(id));
    if(!isApprovalEmote || !hasApprover)
      return;
  }

  let repostWebhook;
  try
  {
    const repostChannel = await reaction.client.channels.fetch(channel) as TextChannel;
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

  /* Include any attachments to the message to repost. */
  const attachmentFiles = [];
  for(const { url } of attachments.toJSON())
    attachmentFiles.push(url);

  /* Repost the message on the react repost channel using a webhook. */
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
