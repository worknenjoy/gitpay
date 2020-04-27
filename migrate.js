'use strict'

const path = require('path');
const child_process = require('child_process');
const Promise = require('bluebird');
const env = process.env.NODE_ENV || 'development';
const database_env = {
  'development': 'databaseDev',
  'production': 'databaseProd',
  'test': 'databaseTest'
};
const config = require('./config/secrets')[database_env[env]];
const Sequelize = require('sequelize');
const Umzug = require('umzug');
let sequelize = {};

if (env === 'production') {
  const database_url = process.env.DATABASE_URL;
  const database_settings = database_url.split(':');
  const port = database_settings[4];
  const host = database_settings[3];
  sequelize = new Sequelize(database_url, {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     port,
    host:     host,
    logging:  false
  });
  console.log('running production migration');

} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const migrationType = process.env.TYPE

const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize: sequelize,
    },

    migrations: {
        params: [
            sequelize.getQueryInterface(), // queryInterface
            sequelize.constructor, // DataTypes
            () => {
                throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
            }
        ],
        path: migrationType === 'seed' ? './migration/seeders' : './migration/migrations',
        pattern: /\.js$/
    },

    logging: () => {
        //console.log.apply(null, arguments);
    },
});

function logUmzugEvent(eventName) {
    return (name, migration) => {
        console.log(`${name} ${eventName}`);
    }
}
umzug.on('migrating', logUmzugEvent('migrating'));
umzug.on('migrated', logUmzugEvent('migrated'));
umzug.on('reverting', logUmzugEvent('reverting'));
umzug.on('reverted', logUmzugEvent('reverted'));

function cmdStatus() {
    let result = {};

    return umzug.executed()
        .then(executed => {
            result.executed = executed;
            return umzug.pending();
        }).then(pending => {
            result.pending = pending;
            return result;
        }).then(({ executed, pending }) => {

            executed = executed.map(m => {
                m.name = path.basename(m.file, '.js');
                return m;
            });
            pending = pending.map(m => {
                m.name = path.basename(m.file, '.js');
                return m;
            });

            const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
            const status = {
                current: current,
                executed: executed.map(m => m.file),
                pending: pending.map(m => m.file),
            }

            //console.log(JSON.stringify(status, null, 2))

            return { executed, pending };
        })
}

function cmdMigrate() {
    return umzug.up();
}

function cmdMigrateNext() {
    return cmdStatus()
        .then(({ executed, pending }) => {
            if (pending.length === 0) {
                return Promise.reject(new Error('No pending migrations'));
            }
            const next = pending[0].name;
            return umzug.up({ to: next });
        })
}

 function cmdUpdateAll() {
    return cmdStatus()
        .then(({ executed, pending }) => {
            let length = pending.length;
            if (length === 0) {
                return Promise.reject(new Error('No pending migrations'));
            }
            length -= 1;
            const next = pending[0].name;
            const last = pending[length].name;
            return umzug.up({ from: next, to: last });
        })
}

function cmdReset() {
    return umzug.down({ to: 0 });
}

function cmdResetPrev() {
    return cmdStatus()
        .then(({ executed, pending }) => {
            if (executed.length === 0) {
                return Promise.reject(new Error('Already at initial state'));
            }
            const prev = executed[executed.length - 1].name;
            return umzug.down({ to: prev });
        })
}

function cmdHardReset() {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                console.log(`dropdb ${config.database}`);
                child_process.spawnSync(`dropdb ${config.database}`);
                console.log(`createdb ${config.database} --username ${config.username}`);
                child_process.spawnSync(`createdb ${config.database} --username ${config.username}`);
                resolve();
            } catch (e) {
                // console.log(e);
                reject(e);
            }
        });
    });
}

const cmd = process.argv[2].trim();
let executedCmd;

// console.log(`${cmd.toUpperCase()} BEGIN`);
switch (cmd) {
    case 'status':
        executedCmd = cmdStatus();
        break;

    case 'up':
    case 'migrate':
        executedCmd = cmdMigrate();
        break;

    case 'next':
    case 'migrate-next':
        executedCmd = cmdMigrateNext();
        break;

    case 'down':
    case 'reset':
        executedCmd = cmdReset();
        break;

    case 'prev':
    case 'reset-prev':
        executedCmd = cmdResetPrev();
        break;

    case 'reset-hard':
        executedCmd = cmdHardReset();
        break;

    case 'update':
        executedCmd = cmdUpdateAll();
        break;

    default:
        console.log(`invalid cmd: ${cmd}`);
        process.exit(1);
}

executedCmd
    .then((result) => {
      const doneStr = `${cmd.toUpperCase()} DONE`;
      // console.log(doneStr);
      console.log("=".repeat(doneStr.length));

    })
    .catch(err => {
      const errorStr = `${cmd.toUpperCase()} ERROR`;
      // console.log(errorStr);
      console.log("=".repeat(errorStr.length));
      // console.log(err);
      console.log("=".repeat(errorStr.length));
    })
    .then(() => {
        if (cmd !== 'status' && cmd !== 'reset-hard') {
            return cmdStatus()
        }
        return Promise.resolve();
    })
    .then(() => process.exit(0))
