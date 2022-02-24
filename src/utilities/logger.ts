import { Message } from 'discord.js';
import winston, { format } from 'winston';
import 'winston-daily-rotate-file';

const rotatingFileTransport = new winston.transports.DailyRotateFile({
  dirname: './logs',
  filename: '%DATE%.log',
  datePattern: 'MM-DD-YYYY',
  zippedArchive: true,
  maxFiles: 7,
});

const time = (withDate?: boolean) =>
{
  let timestamp = new Date().toISOString();
  if(!withDate)
    timestamp = timestamp.substring(timestamp.indexOf('T') + 1).replace('Z', '');
  return timestamp;
};

const Logger = winston.createLogger({
  transports: [rotatingFileTransport],
  format: format.printf(({ message }) => `[${time()}] ${message}`),
});

enum LogLevels
{
  COMMAND = 'CMD',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
};

export class Log
{
  private static output = (level: LogLevels, content: string, logInConsole?: boolean) =>
  {
    const log = `${level.toString()}: ${content}`;
    Logger.info(log);

    if(logInConsole)
      console.log(`[${time(true)}] ${log}`);
  };

  static info = (message: string, logInConsole?: boolean) =>
    Log.output(LogLevels.INFO, message, logInConsole);

  static warn = (message: string, logInConsole?: boolean) =>
    Log.output(LogLevels.WARNING, message, logInConsole);

  static error = (error: string | Error | any) =>
  {
    let log;
    if(typeof error === 'string')
      log = error;
    else
      log = error.stack ? error.stack.replace(/Error\:\s+/g, '') : error.message;

    Log.output(LogLevels.ERROR, log, true);
  };

  static command = (message: Message, logInConsole?: boolean) =>
  {
    let log = '(';

    if(message.inGuild())
      log += `${message.guild.name} - #${message.channel.name}, `;

    log += `@${message.author.tag}) '${message.content}'`;

    Log.output(LogLevels.COMMAND, log, logInConsole);
  };
}
