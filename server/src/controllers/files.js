const path = require('path');
const fs = require('fs');

const root = path.resolve('files');

/**
 * @param {string} filepath 
 */
const getFileStruct = filepath => new Promise((resolve, reject) => {
    fs.stat(filepath, (err, stats) => {
        if (err) return reject(err);

        const filename = filepath.split('/').pop();

        resolve({
            name: filename,
            isDir: stats.isDirectory(),
        });
    });
});

/**
 * @param {string} filepath 
 */
const getFiles = filepath => new Promise((resolve, reject) => {
    fs.readdir(filepath, async (err, files) => {
        if (err) return reject(err);

        try {
            const fileStructs = await Promise.all(files.map(file => getFileStruct(`${filepath}/${file}`)));

            const filelist = fileStructs.sort((a, b) => {
                if (b.isDir) {
                    if (!a.isDir) {
                        return 1;
                    }
                } else if (a.isDir) {
                    return -1;
                }

                return a.name.localeCompare(b.name);
            });

            resolve(filelist);
        } catch (e) {
            reject(e);
        }
    });
});

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.getUserFiles = (req, res) => {
    if (!req.session.connected) {
        return res.status(403).send([]);
    }

    if (!req.params) {
        req.params = {};
    }

    const [username, ...path] = Object.values(req.params);

    const filepath = `${root}/${username}/${path}`;

    fs.stat(filepath, async (err, stats) => {
        if (err) return res.send([]);

        if (stats.isDirectory()) {

            try {
                const files = await getFiles(filepath);

                res.send(files);
            } catch (e) {
                res.send([])
            }
        } else {
            fs.readFile(filepath, (err, data) => {
                if (err) res.send("");

                res.send(data);
            });
        }
    });
}


/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.putFile = async (req, res) => {
    if (!req.session.connected || !req.busboy) {
        return res.status(403).send([]);
    }

    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

        file.on('data', data => {
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });

        file.on('end', () => {
            console.log('File [' + fieldname + '] Finished');
        });

        file.on('error', err => {
            console.log(err);
        });
    });

    req.pipe(req.busboy);
}

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

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
exports.tree = async (req, res) => {
    if (!req.session.connected) {
        return res.status(403).end([]);
    }

    try {
        const directories = await getDirectories('/');

        console.log(directories);
        res.send(directories);
    } catch (e) {
        console.error(e);
        res.send([]);
    }
}