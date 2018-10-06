const path = require('path');
const fs = require('fs');

const root = path.resolve('files');

/**
 * 
 * @param {string} filepath 
 */
const getDirectories = filepath => new Promise((resolve, reject) => {
  const dirFullPath = path.join(root, filepath);

  fs.readdir(dirFullPath, async (err, files) => {
    if (err) return resolve([]);

    if (files.length <= 0) {
      return resolve([]);
    }

    const promises = files.map(file => new Promise((resolve, reject) => {
      fs.stat(path.join(dirFullPath, file), (err, stats) => {
        if (err) return reject(err);

        if (stats.isDirectory()) {
          resolve(`${filepath}${filepath.endsWith('/') ? '' : '/'}${file}`);
        } else {
          resolve();
        }
      })
    }));

    try {
      let directories = await Promise.all(promises);
      directories = directories.filter(directory => directory);

      for (directory of directories) {
        const child = await getDirectories(directory)
        directories = directories.concat(child);
      }

      resolve(directories);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
});

getDirectories('/')
  .then(console.log)
  .catch(() => { });