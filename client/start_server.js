const { spawn } = require('child_process');
const fs = require('fs');

const out = fs.openSync('./server_out.log', 'a');
const err = fs.openSync('./server_err.log', 'a');

const p = spawn('npx.cmd', ['next', 'dev', '-p', '3001'], {
    detached: true,
    stdio: ['ignore', out, err]
});

p.unref();
console.log('Started server with PID:', p.pid);
