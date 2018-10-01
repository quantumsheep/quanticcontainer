const { spawn } = require('child_process');
const readline = require('readline');

const main = async () => {
    const child = spawn('ssh', ["root@qtmsheep.com"]);

    child.on('exit', code => {
        console.log(`Exit code is: ${code}`);
    });

    process.stdin.pipe(child.stdin);
    child.stdout.pipe(process.stdout);
}

main();