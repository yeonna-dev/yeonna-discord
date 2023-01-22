import fastglob from 'fast-glob';

/* Loads all the command scripts except the index.ts. */
export async function loadCommands()
{
  const commandFiles = fastglob.sync([`**/*.command.{js,ts}`], {
    onlyFiles: true,
    absolute: true,
    objectMode: true,
    cwd: `${__dirname}`,
    ignore: [`**/index.{js,ts}`],
  });

  const commands = [];
  for(const { path, name } of commandFiles)
  {
    const imported = await import(path);
    commands.push(imported[name.substring(0, name.indexOf('.'))]);
  }

  return commands;
};
