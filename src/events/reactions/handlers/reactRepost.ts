import { MessageReaction, PartialMessageReaction, PartialUser, User } from 'discord.js';
import { Config } from '../../../utilities/config';
import { Log } from '../../../utilities/logger';
import { createDiscordEmbed } from '../../../helpers/createEmbed';

export async function reactRepost(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser)
{
  const guildId = reaction.message.guildId;
  if(!guildId)
    return;

  const { reactRepost: reactRepostConfig } = Config.ofGuild(guildId);
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

  let repostChannel;
  try
  {
    repostChannel = await reaction.client.channels.fetch(reactRepostChannel);
  }
  catch(error: any)
  {
    Log.error(error);
  }

  const reactMessage = reaction.message;
  if(!repostChannel || !repostChannel.isText() || !reactMessage || !reactMessage.member)
    return;

  const embed = createDiscordEmbed({
    color: reactRepostConfig.color,
    author: {
      name: reactMessage.member.displayName,
      iconURL: reactMessage.member.displayAvatarURL() || undefined,
      url: reactMessage.url,
    },
    description: (reactMessage.content || undefined),
    // + `\n\n⎯⎯⎯\n[Go to message](${reactMessage.url})`,
    timestamp: reactMessage.createdTimestamp,
  });

  repostChannel.send({ embeds: [embed] });
}
