#!/usr/bin/env node

const task = process.argv.slice(2);


switch (task[0]) {
    case 'build':
        require('./build');
        break;
		
    case 'start':
        require('./start');
        break;

    case 'sync':
        require('./sync');
        break;

    default:
        console.log('task not found');
}