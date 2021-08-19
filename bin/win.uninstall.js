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

svc.on('alreadyinstalled', function () {
    console.log('This service is already installed.');
    svc.uninstall();
});

svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

svc.install();
