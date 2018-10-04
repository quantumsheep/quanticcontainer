const path = require('path');
const fs = require('fs');

const filespath = path.resolve('files');

/**
 * @param {string} path 
 */
const getFileStruct = path => new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
        if (err) return reject(err);

        const filename = path.split('/').pop();

        resolve({
            name: filename,
            isDir: stats.isDirectory(),
        });
    });
});

/**
 * @param {string} username 
 * @param {string} path 
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

    try {
        const filepath = `${filespath}/${username}/${path}`;

        fs.stat(filepath, async (err, stats) => {
            if (err) return res.send([]);

            if (stats.isDirectory()) {
                const files = await getFiles(username, path.join('/'));

                res.send(files);
            } else {
                fs.readFile(filepath, (err, data) => {
                    if(err) res.send("");

                    res.send(data);
                });
            }
        });

    } catch (e) {
        res.send([])
    }
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