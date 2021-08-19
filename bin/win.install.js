var Service = require('node-windows').Service;

var svc = new Service({
    name: 'Prototype DB-Server',
    description: 'Prototype DB-Server',
    script: 'C:\\Dev\\Apps\\app-psht\\server\\bin\\www.js',
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=2048'
    ],
    env: {
        name: "NODE_ENV",
        value: "production"
    }
});

svc.on('install', function () {
    svc.start();
});
svc.on('start', function () {
    console.log(svc.name + ' started!\nVisit http://127.0.0.1:3000 to see it in action.');
});

svc.install();
