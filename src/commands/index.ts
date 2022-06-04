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

  const importPromises = [];
  for(const { path, name } of commandFiles)
    importPromises.push(
      import(path)
        .then(imported => imported[name.substring(0, name.indexOf('.'))])
    );

  return Promise.all(importPromises);
};
