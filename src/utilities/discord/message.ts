import { MessageOptions } from 'child_process';
import
{
  Channel,
  ColorResolvable,
  GuildMember,
  Message,
  MessageEditOptions,
  MessageEmbed,
  MessagePayload,
  MessageReaction,
  Permissions,
  ReplyMessageOptions,
  TextBasedChannel,
  User,
} from 'discord.js';

import { Log } from '../logger';

/* Wrapper of the Message class of Discord.js */
export class DiscordMessage
{
  public original: Message;
  public id: string;
  public content: string;
  public fromBot: Boolean;
  public client: {
    ping: Number;
    getUser(discordID: string): Promise<User> | undefined;
  };

  public guild: {
    id: string | undefined;
    name: string | undefined;
    getMember(discordID: string): Promise<GuildMember> | undefined;
  };

  public channel: {
    name: string | undefined;
    isDM(): boolean;
    startTyping(): Promise<void>;
    send({
      content,
      embeds,
    }: {
      content?: string,
      embeds?: MessageEmbed[],
    }): Promise<DiscordMessage>;
    send(text: string): Promise<DiscordMessage>;
    sendPaginated({
      createPage,
      involvedUserIDs,
    }: {
      createPage(page: number): string,
      involvedUserIDs: string[],
    }): Promise<void>;
  };

  public member: {
    displayName: string | undefined;
  };

  public author: {
    id: string;
    tag: string;
    mention: string;
  };

  public mentions: {
    members:
    {
      first(): GuildMember | undefined;
    };
    channels:
    {
      first(): TextBasedChannel | undefined;
    };
  };

  constructor(message: Message)
  {
    this.original = message;

    this.id = message.id;

    this.content = message.content;

    this.fromBot = message.author.bot;

    this.client =
    {
      ping: message.client.ws.ping,

      getUser: discordID =>
      {
        try
        {
          return message.client.users.fetch(discordID);
        }
        catch(error: any)
        {
          /*
            Error code `10013` is when the given user is an unknown user.
            Error code `10007` is when the user is not a member of the server.
          */
          if(error.code !== 10013 && error.code !== 10007)
            Log.error(error);
        }
      }
    };

    this.guild =
    {
      id: message.guild?.id,

      name: message.guild?.name,

      getMember: discordID =>
      {
        try
        {
          return message.guild?.members.fetch(discordID);
        }
        catch(error: any)
        {
          /* Error code `10013` is when the given user is an unknown user. */
          if(error.code !== 10013)
            Log.error(error);
        }
      },
    };

    this.channel =
    {
      name: message.channel.type !== 'DM' ? message.channel.name : undefined,

      isDM: () => message.channel.type === 'DM',

      startTyping: () => message.channel.sendTyping(),

      send: async options =>
      {
        const sentMessage = await message.channel.send(options);
        return new DiscordMessage(sentMessage);
      },

      sendPaginated: async ({
        createPage,
        involvedUserIDs,
      }) =>
      {
        let pageNumber = 0;
        const sentMessage = await message.channel.send(createPage(pageNumber));
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
      },
    };

    this.member =
    {
      displayName: message.member?.displayName,
    };

    this.author =
    {
      id: message.author.id,

      tag: message.author.tag,

      mention: `<@${message.author.id}>`,
    };

    this.mentions =
    {
      members:
      {
        first: () => message.mentions.members?.first(),
      },
      channels:
      {
        first: () => message.mentions.channels.first(),
      },
    };
  }

  public canSendInChannel = (channel: TextBasedChannel) =>
  {
    const message = this.original;
    return message?.guild?.me?.permissionsIn(channel.id).has([
      Permissions.FLAGS.VIEW_CHANNEL,
      Permissions.FLAGS.SEND_MESSAGES,
    ]);
  };

  public inGuild = () => this.original.inGuild();

  public edit = (params: string | MessagePayload | MessageEditOptions) => this.original.edit(params);

  public waitReact = async ({
    reactions,
    userId,
    time,
    onReact,
  }: {
    reactions: string | string[],
    userId?: string,
    time?: number,
    onReact: ({ emote, user }: { emote: string | null, user: User | undefined; }) => any,
  }) =>
  {
    if(!Array.isArray(reactions))
      reactions = [reactions];

    for(const reaction of reactions)
      await this.original.react(reaction);

    const reactionCollector = this.original.createReactionCollector({
      filter: (react, user) => (
        user.id !== this.original.client.user?.id &&
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
  };

  public waitReplyToMessage = ({
    messageId,
    time,
    onReply,
  }: {
    messageId: string,
    time: number,
    onReply: (reply: DiscordMessage) => void,
  }) =>
  {
    const messageCollector = this.original.channel.createMessageCollector({
      filter: message => (
        message.author.id === this.original.author.id &&
        message.type === 'REPLY' &&
        !!message.reference &&
        message.reference.messageId === messageId
      ),
      max: 1,
      time,
    });

    messageCollector.on('collect', message =>
    {
      onReply(new DiscordMessage(message));
    });
  };

  public reply = (options: string | MessagePayload | ReplyMessageOptions) =>
    this.original.reply(options);

  public sendInChannel = async ({
    channelId,
    options,
  }: {
    channelId: string,
    options: string | MessageOptions | MessagePayload,
  }) =>
  {
    const channel = await this.original.client.channels.fetch(channelId);
    if(!channel || !channel.isText())
      return;

    const sentMessage = await channel.send(options as MessagePayload);
    return new DiscordMessage(sentMessage);
  };

  public sendToUser = async ({
    userId,
    options,
  }: {
    userId: string,
    options: string | MessageOptions | MessagePayload,
  }) =>
  {
    const user = await this.original.client.users.fetch(userId);
    if(!user)
      return;

    const sentMessage = await user.send(options as MessagePayload);
    return new DiscordMessage(sentMessage);
  };

  public createRole = async ({ name, color }: { name: string, color: string, }) =>
  {
    const guild = this.original.guild;
    if(!guild)
      return;

    if(color === '#000000')
      color = '#000001';

    const role = await guild.roles.create({ name, color: color as ColorResolvable });
    return role.id;
  };

  public assignRole = (roleId?: string) =>
  {
    const member = this.original.member;
    if(!member || !roleId)
      return;

    return member.roles.add(roleId);
  };
}
