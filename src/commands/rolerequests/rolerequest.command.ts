import { Command } from 'comtroller';
import colors from 'src/libs/color-names.json';
import { Discord } from 'src/libs/discord';
import { Log } from 'src/libs/logger';
import { RoleRequestsCommandResponse } from 'src/responses/roleRequests';
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
  private response: RoleRequestsCommandResponse;
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
    this.response = new RoleRequestsCommandResponse(discord);
    this.start();
  }

  async start()
  {
    const guildId = this.discord.getGuildId();
    if(!guildId)
      return this.response.guildOnly();

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
      return this.response.noRoleRequestsChannel();
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
      return this.response.noNameOrColor();

    this.discord.startTyping();

    const roleRequestId = await this.saveRoleRequest();
    if(!roleRequestId)
      return this.response.cannotCreateRequest();

    this.requestId = roleRequestId;

    this.postRequest();
    this.response.requestCreated({ name, color });
  }

  async promptName()
  {
    const namePrompt = await this.response.roleNamePrompt();

    return new Promise<string | undefined>(resolve =>
    {
      this.waitReply(namePrompt.getMessageId(), discord => resolve(discord.getMessageContent()));
      this.waitCancel(namePrompt, () => resolve(undefined));
    });
  }

  async promptColor()
  {
    const colorPrompt = await this.response.roleColorPrompt();

    return new Promise<string | undefined>(resolve =>
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
            return new RoleRequestsCommandResponse(discord).invalidRoleColor();
        }

        resolve(color);
      });

      this.waitCancel(colorPrompt, () => resolve(undefined));
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
      return this.response.noRoleRequestsChannel();

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

    if(!this.requestId || !botPrefix)
      return;

    this.response.requestPost(this.roleRequestsChannel, {
      name: this.name,
      color: this.color,
      requestId: this.requestId,
      requesterMention: this.discord.getAuthor().toString(),
      botPrefix
    });
  }

  startTimer()
  {
    this.timeout = setTimeout(() =>
    {
      if(this.stopped)
        return;

      this.stopped = true;
      this.response.noReply();
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
