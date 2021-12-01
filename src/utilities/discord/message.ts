import
{
  GuildMember,
  Message,
  MessageEditOptions,
  MessageEmbed,
  MessagePayload,
  MessageReaction,
  User,
} from 'discord.js';

import { Log } from '../logger';

/* Wrapper of the Message class of Discord.js */
export class DiscordMessage
{
  public original: Message;
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
  };

  public mentions: {
    members:
    {
      first(): GuildMember | undefined;
    };
  };

  constructor(message: Message)
  {
    this.original = message;

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
          .createReactionCollector({ filter, time: 30000, dispose: true });

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
        reactCollector.on('end', () => sentMessage.reactions.removeAll());
      },
    };

    this.member =
    {
      displayName: message.member?.displayName,
    };

    this.author =
    {
      id: message.author.id,

      tag: message.author.tag
    };

    this.mentions =
    {
      members:
      {
        first: () => message.mentions.members?.first(),
      },
    };
  }

  public inGuild = () => this.original.inGuild();

  public edit = (params: string | MessagePayload | MessageEditOptions) => this.original.edit(params);
}
