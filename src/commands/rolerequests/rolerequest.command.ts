import { Command } from 'comtroller';
import colors from 'src/libs/color-names.json';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { Config } from 'yeonna-config';
import { Core } from 'yeonna-core';

export const rolerequest: Command =
{
  name: 'rolerequest',
  aliases: ['rr'],
  run: async ({ discord }: { discord: Discord, params: string, }) =>
    new RoleRequest(discord),
};

class RoleRequest
{
  private discord: Discord;
  private guildId?: string;
  private roleRequestsChannel?: string;
  private name?: string;
  private color?: string;
  private requestId?: string;
  private timeout?: NodeJS.Timeout;
  private stopped?: boolean;

  private timeoutTime = 60000;

  constructor(discord: Discord)
  {
    this.discord = discord;
    this.start();
  }

  async start()
  {
    const guildId = this.discord.getGuildId();
    if(!guildId)
      return this.discord.send('This command can only be used in a guild.');

    this.guildId = guildId;


    let roleRequestsApprovalChannel;
    try
    {
      const guildConfig = await Config.ofGuild(this.guildId);
      roleRequestsApprovalChannel = guildConfig.roleRequestsApprovalChannel;
    }
    catch(error)
    {
      Log.error(error);

      const response = this.createMessageWithMention(
        'The role requests channel has not been set up yet.'
        + ' Please inform the server administrator to set this up.'
      );

      return this.discord.send(response);
    }

    this.roleRequestsChannel = roleRequestsApprovalChannel;

    this.startTimer();

    const name = await this.promptName();
    if(name)
      this.name = name;

    this.restartTimer();

    const color = await this.promptColor();
    if(color)
      this.color = color;

    this.stopTimer();

    if(!this.name && !this.color)
      return this.sendNoNameOrColor();

    this.discord.startTyping();

    const roleRequestId = await this.saveRoleRequest();
    if(!roleRequestId)
      return this.discord.send('Cannot create a role request. Please try again.');

    this.requestId = roleRequestId;

    this.postRequest();
    this.sendRequestResponse();
  }

  async promptName()
  {
    const response = this.createMessageWithMention(
      'What should be the role name?'
      + '\nPlease **reply** it to this message.'
      + "\nReact with ❌ if you don't want a specific name."
    );

    const namePrompt = await this.discord.send(response);

    return new Promise<string | void>(resolve =>
    {
      this.waitReply(namePrompt.getMessageId(), discord => resolve(discord.getMessageContent()));
      this.waitCancel(namePrompt, () => resolve());
    });
  }

  async promptColor()
  {
    const response = this.createMessageWithMention(
      'What should be the role color?'
      + '\nPlease **reply** it to this message.'
      + "\nReact with ❌ if you don't want a specific color."
      + '\n(Please provide a valid __color hex__ code, e.g. #4caf50.)'
    );

    const colorPrompt = await this.discord.send(response);

    return new Promise<string | void>(resolve =>
    {
      this.waitReply(colorPrompt.getMessageId(), discord =>
      {
        this.stopTimer();

        let content = discord
          .getMessageContent()
          .toLowerCase()
          .replace(/\s/g, '') as keyof typeof colors;

        let color = colors[content];
        if(!color)
        {
          if(content.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/))
            color = content;
          else
            return discord.reply(
              'This color is not valid. Please try using the role request command again.'
            );
        }

        resolve(color);
      });

      this.waitCancel(colorPrompt, () => resolve());
    });
  }

  async waitReply(messageId: string, onReply: (reply: Discord) => void)
  {
    this.discord.waitReplyToMessage({
      messageId,
      time: this.timeoutTime,
      onReply,
    });
  }

  async waitCancel(discord: Discord, onCancel: () => void)
  {
    await discord.waitReact({
      reactions: '❌',
      userId: this.discord.getAuthorId(),
      time: this.timeoutTime,
      onReact: onCancel,
    });
  }

  async saveRoleRequest()
  {
    if(!this.guildId)
      return;

    try
    {
      const roleRequest = await Core.Discord.createRoleRequest({
        roleName: this.name,
        roleColor: this.color,
        requesterDiscordId: this.discord.getAuthorId(),
        discordGuildId: this.guildId,
      });

      return roleRequest.id;
    }
    catch(error)
    {
      Log.error(error);
    }
  }

  async postRequest()
  {
    if(!this.guildId)
      return;

    if(!this.roleRequestsChannel)
      return this.discord.send('No role requests channel has been set.');

    let botPrefix;
    try
    {
      const config = await Config.ofGuild(this.guildId);
      botPrefix = config.prefix;

      if(!botPrefix)
      {
        const globalConfig = await Config.global();
        botPrefix = globalConfig.prefix;
      }
    }
    catch(error)
    {
      Log.error(error);
      botPrefix = ';';
    }

    const roleRequestEmbed = this.discord.createDiscordEmbed({
      color: (this.color || 'DEFAULT'),
      title: '✋ Role Request',
      description: `Name: **${this.name || '(No name specified)'}**`
        + `\nColor: **${this.color || '(No color specified)'}**`
        + `\nRequested By: __${this.discord.getAuthor()}__`
        + `\n\nTo approve, copy this: \n\`\`\`${botPrefix}rra ${this.requestId}\`\`\``
        + `\n\nTo decline, copy this: \n\`\`\`${botPrefix}rrd ${this.requestId}\`\`\``,
      footer: { text: `ID: ${this.requestId}` },
      timestamp: new Date()
    });

    this.discord.sendInChannel(this.roleRequestsChannel, { embeds: [roleRequestEmbed] });
  }

  sendRequestResponse()
  {
    const roleEmbed = this.discord.createDiscordEmbed({
      title: this.name || '(No name specified)',
      color: this.color || 'DEFAULT',
    });

    const content = this.createMessageWithMention(
      'Successfully created a request for the role below.'
      + '\nPlease wait for it to be approved.'
    );

    this.discord.sendTextWithEmbeds(content, [roleEmbed]);
  }

  sendNoNameOrColor()
  {
    const response = this.createMessageWithMention('Please provide either a name or color.');
    this.discord.send(response);
  }

  startTimer()
  {
    this.timeout = setTimeout(() =>
    {
      if(this.stopped)
        return;

      this.stopped = true;

      const response = this.createMessageWithMention(
        'You did not respond. Please try using the role request command again.'
      );

      this.discord.send(response);
    }, this.timeoutTime);
  }

  stopTimer()
  {
    if(this.timeout)
      clearTimeout(this.timeout);
  }

  restartTimer()
  {
    this.stopTimer();
    this.startTimer();
  }

  createMessageWithMention(message: string)
  {
    return `${this.discord.getAuthor()}\n${message}`;
  }
}
