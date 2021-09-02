import fs from 'fs';

/* Loads all the command scripts except the index.ts. */
export async function loadCommands()
{
  const commandFiles = fs.readdirSync(__dirname);
  commandFiles.splice(commandFiles.findIndex(file => file.startsWith('index')), 1);

  const commands = [];
  for(const commandFile of commandFiles)
  {
    const command = await import(`${__dirname}/${commandFile}`);
    commands.push(command[commandFile.substr(0, commandFile.lastIndexOf('.'))]);
  }

  return commands;
};
