const path = require('path');

const cp = require('child_process');

const chokidar = require('chokidar');

const watcher = chokidar.watch(path.join(__dirname, '/src'));

let appIns = cp.fork(path.join(__dirname, '/bin/www.js'));
watcher.on('ready', () => {

      watcher.on('change', (path) => {

            console.log('<---- watched file change, reload ---->');

            appIns = reload(appIns);

      });

      watcher.on('add', (path) => {

            console.log('<---- watched new file add, reload ---->');

            appIns = reload(appIns);

      });

      watcher.on('unlink', (path) => {

            console.log('<---- watched file remove, reload ---->');

            appIns = reload(appIns);

      });

});

process.on('SIGINT', () => {

      process.exit(0);

});

function reload(appIns) {

      appIns.kill('SIGINT');

      return cp.fork(require('path').join(__dirname, '/bin/www.js'));

}
