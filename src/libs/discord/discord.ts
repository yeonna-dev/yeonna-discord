import
{
  Channel,
  ColorResolvable,
  FileOptions,
  Message,
  MessageEditOptions,
  MessageEmbed,
  MessageOptions,
  MessagePayload,
  MessageReaction,
  Permissions,
  User
} from 'discord.js';
import { Log } from 'src/libs/logger';

export class Discord
{
  private message: Message;

  constructor(message: Message)
  {
    this.message = message;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* Getting properties */
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  getPing()
  {
    return this.message.client.ws.ping;
  }

  getMessageId()
  {
    return this.message.id;
  }

  getMessageContent()
  {
    return this.message.content;
  }

  getAuthor()
  {
    return this.message.author;
  }

  getAuthorId()
  {
    return this.message.author.id;
  }

  async getUsername(userId?: string)
  {
    if(!userId)
      return this.message.author.username;

    const user = await this.fetchUser(userId);
    return user?.username;
  }

  async getChannel(channelId?: string)
  {
    if(!channelId)
      return this.message.channel;

    return this.message.guild?.channels.fetch(channelId);
  }

  getChannelId()
  {
    return this.message.channel.id;
  }

  async isTextChannel(channel?: string | Channel)
  {
    if(channel instanceof Channel)
      return channel.isText();

    const fetchedChannel = await this.getChannel(channel);
    return fetchedChannel?.isText();
  }

  getGuildId()
  {
    return this.message.guild?.id;
  }

  async getGuildMemberId(idOrMention?: string)
  {
    if(!idOrMention)
      return this.message.member?.id;

    const member = await this.fetchGuildMember(idOrMention);
    return member?.id;
  }

  async getGuildMemberDisplayName(userId?: string)
  {
    if(!userId)
      return this.message.member?.displayName;

    const member = await this.fetchGuildMember(userId);
    return member?.displayName || member?.nickname;
  }

  getMentionedMember()
  {
    return this.message.mentions.members?.first();
  }

  getMentionedMemberId()
  {
    return this.getMentionedMember()?.id;
  }

  getMentionedMemberDisplayName()
  {
    const member = this.getMentionedMember();
    return member?.displayName || member?.nickname;
  }

  getMentionedChannel()
  {
    return this.message.mentions.channels?.first();
  }

  getMentionedChannelId()
  {
    return this.getMentionedChannel()?.id;
  }

  mentionedChannelIsText()
  {
    return this.getMentionedChannel()?.isText();
  }

  canSendInChannel(channelId: string)
  {
    const message = this.message;
    return message.guild?.me?.permissionsIn(channelId || message.channel.id).has([
      Permissions.FLAGS.VIEW_CHANNEL,
      Permissions.FLAGS.SEND_MESSAGES,
    ]);
  }

  getMediaFromMessage({ imageOnly }: { imageOnly?: boolean; } = {})
  {
    const imageMediaTypes = ['jpg', 'png', 'webp'];
    let mediaTypes = [...imageMediaTypes, 'gif'];
    if(imageOnly)
      mediaTypes = imageMediaTypes;

    const { content, attachments } = this.message;

    /* If the message has a URL, check if it is a valid image type and get the URL. */
    const urlMatch = content.trim().toLowerCase().match(/\bhttps?:\/\/\S+/gi);
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

    const firstAttachment = attachments.first();
    if(!firstAttachment || attachments.size === 0)
      return;

    return firstAttachment.url;
  }

  async fetchUser(userId: string)
  {
    return this.message.client.users.fetch(userId);
  }

  async fetchGuildMember(idOrMention: string)
  {
    const { guild } = this.message;
    if(!guild)
      return;

    if(idOrMention.startsWith('<@') && idOrMention.endsWith('>'))
    {
      idOrMention = idOrMention.slice(2, -1);

      if(idOrMention.startsWith('!'))
        idOrMention = idOrMention.slice(1);

      if(idOrMention.startsWith('&'))
        idOrMention = idOrMention.slice(1);
    }

    return guild.members.fetch(idOrMention);
  }

  async fetchGuildEmojis()
  {
    const emojiManager = this.message.guild?.emojis;
    if(!emojiManager)
      return;

    /* Any errors are caught here because the cached emojis
      will be returned if the emojis cannot be fetched. */
    let existingEmotes;
    try
    {
      existingEmotes = await emojiManager.fetch();
    }
    catch(error: any)
    {
      Log.error(error);
      existingEmotes = emojiManager.cache;
    }

    return existingEmotes;
  }

  async findGuildEmoji(nameOrId: string)
  {
    const emojis = await this.fetchGuildEmojis();
    if(!emojis)
      return;

    return emojis.find(emoji =>
      emoji.id === nameOrId ||
      emoji.name === nameOrId
    );
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* Discord.js function calls or actions */
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  startTyping()
  {
    return this.message.channel.sendTyping();
  }

  async reply(content: string | MessageOptions | MessagePayload)
  {
    const replyMessage = await this.message.reply(content);
    return new Discord(replyMessage);
  }

  private getEmbed(embed: MessageEmbed | Parameters<typeof this.createDiscordEmbed>[0])
  {
    if(!(embed instanceof MessageEmbed))
      embed = this.createDiscordEmbed(embed);

    return embed;
  }

  async replyEmbed(embed: Parameters<typeof this.getEmbed>[0])
  {
    embed = this.getEmbed(embed);
    const replyMessage = await this.message.reply({ embeds: [embed] });
    return new Discord(replyMessage);
  }

  async send(text: string)
  {
    const sentMessage = await this.message.channel.send(text);
    return new Discord(sentMessage);
  }

  sendEmbed(embed: Parameters<typeof this.getEmbed>[0])
  {
    embed = this.getEmbed(embed);
    return this.message.channel.send({ embeds: [embed] });
  }

  sendFiles(files: string[] | Buffer[])
  {
    const attachments: FileOptions[] = files.map(file => ({ attachment: file }));
    return this.message.channel.send({ files: attachments });
  }

  async sendTextWithEmbeds(text: string, embeds: MessageEmbed[])
  {
    return this.message.channel.send({ content: text, embeds });
  }

  async sendInChannel(channelId: string, options: string | MessageOptions)
  {
    const channel = await this.message.client.channels.fetch(channelId);
    if(!channel || !channel.isText())
      return;

    const sentMessage = await channel.send(options as MessagePayload);
    return new Discord(sentMessage);
  };

  async sendToUser(userId: string, options: string | MessageOptions | MessagePayload)
  {
    const user = await this.message.client.users.fetch(userId);
    if(!user)
      return;

    return user.send(options);
  }

  edit(content: string | MessageEditOptions | MessagePayload)
  {
    return this.message.edit(content);
  }

  async createGuildEmoji(mediaUrl: string, name: string)
  {
    const emojiManager = this.message.guild?.emojis;
    if(!emojiManager)
      return;

    return emojiManager.create(mediaUrl, name);
  }

  async createRole({ name, color }: { name: string, color: string, })
  {
    const guild = this.message.guild;
    if(!guild)
      return;

    /* Convert true black color hex code to #000001 because
      Discord does not accept #000000 for role colors. */
    if(color === '#000000')
      color = '#000001';

    const role = await guild.roles.create({ name, color: color as ColorResolvable });
    return role.id;
  }

  async getRoles(memberId: string, asCollection?: boolean)
  {
    const member = await this.fetchGuildMember(memberId);
    if(!member)
      return;

    return asCollection ? member.roles : member.roles.cache;
  }

  async assignRole(memberId: string, roleId: string)
  {
    const member = await this.fetchGuildMember(memberId);
    if(!member || !roleId)
      return;

    return member.roles.add(roleId);
  }

  async unassignRole(memberId: string, roleId: string)
  {
    const member = await this.fetchGuildMember(memberId);
    if(!member || !roleId)
      return;

    return member.roles.remove(roleId);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* User-involved interactions */
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  async sendPaginated({
    createPage,
    involvedUserIDs,
  }: {
    createPage(page: number): string,
    involvedUserIDs: string[],
  }): Promise<void>
  {
    let pageNumber = 0;
    const sentMessage = await this.message.channel.send(createPage(pageNumber));
    const previousIcon = '⬅️';
    const nextIcon = '➡️';
    await sentMessage.react(previousIcon);
    await sentMessage.react(nextIcon);

    const filter = ({ emoji }: MessageReaction, user: User) =>
      [previousIcon, nextIcon].includes(emoji.name || '') && involvedUserIDs.includes(user.id);

    const reactCollector = sentMessage
      .createReactionCollector({ filter, time: 50000, dispose: true });

    const onReact = async ({ emoji }: MessageReaction) =>
    {
      const newPage = pageNumber + (emoji.name === nextIcon ? 1 : -1);
      if(newPage < 0)
        return;

      pageNumber = newPage;
      await sentMessage.edit(createPage(pageNumber));
    };

    reactCollector.on('collect', onReact);
    reactCollector.on('remove', onReact);
    reactCollector.on('end', async () =>
    {
      try
      {
        await sentMessage.reactions.removeAll();
      }
      catch(error: any)
      {
        Log.error(error);
      }
    });
  }

  waitReplyToMessage({
    messageId,
    time,
    onReply,
  }: {
    messageId: string,
    time: number,
    onReply: (reply: Discord) => void,
  })
  {
    const messageCollector = this.message.channel.createMessageCollector({
      filter: message => (
        message.author.id === this.message.author.id &&
        message.type === 'REPLY' &&
        !!message.reference &&
        message.reference.messageId === messageId
      ),
      max: 1,
      time,
    });

    messageCollector.on('collect', message =>
    {
      onReply(new Discord(message));
    });
  }

  async waitReact({
    reactions,
    userId,
    time,
    onReact,
  }: {
    reactions: string | string[],
    userId?: string,
    time?: number,
    onReact: ({ emote, user }: { emote: string | null, user: User | undefined; }) => any,
  })
  {
    if(!Array.isArray(reactions))
      reactions = [reactions];

    for(const reaction of reactions)
      await this.message.react(reaction);

    const reactionCollector = this.message.createReactionCollector({
      filter: (react, user) => (
        user.id !== this.message.client.user?.id &&
        reactions.includes(react.emoji.name || '') &&
        (userId ? user.id === userId : true)
      ),
      max: 1,
      time,
    });

    reactionCollector.on('collect', (reaction, user) => onReact({
      emote: reaction.emoji.name,
      user,
    }));
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  /* Helpers */
  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  createDiscordEmbed({
    title,
    description,
    color,
    author,
    timestamp,
    footer,
    image,
    fields,
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
    fields?: {
      name: string;
      value: string;
      inline?: boolean;
    }[];
  }): MessageEmbed
  {
    const embed = new MessageEmbed();

    if(title)
      embed.setTitle(title);

    if(description)
      embed.setDescription(description);

    // TODO: Change default color and make it per-config (server/command)
    if(!color)
      color = '#2F3136';

    embed.setColor(color as ColorResolvable);

    if(author)
      embed.setAuthor(author);

    if(timestamp)
      embed.setTimestamp(timestamp);

    if(footer)
      embed.setFooter(footer);

    if(image)
      embed.setImage(image);

    if(fields)
    {
      for(const { name, value, inline } of fields)
        embed.addField(name, value, inline);
    }

    return embed;
  }

  userMention(id: string)
  {
    return `<@${id}>`;
  }

  channelMention(id: string)
  {
    return `<#${id}>`;
  }
}