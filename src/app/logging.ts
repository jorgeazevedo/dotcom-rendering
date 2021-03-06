import path from 'path';
import { configure, getLogger, addLayout, shutdown } from 'log4js';

const logLocation =
    process.env.NODE_ENV === 'production'
        ? '/var/log/dotcom-rendering/dotcom-rendering.log'
        : `${path.resolve('logs')}/dotcom-rendering.log`;

const logFields = (logEvent: any): any => {
    return {
        stack: 'frontend',
        app: 'dotcom-rendering',
        stage: 'CODE',
        '@timestamp': logEvent.startTime,
        '@version': 1,
        level: logEvent.level.levelStr,
        level_value: logEvent.level.level,
        message: logEvent.data.join(','),
    };
};

addLayout('json', () => {
    return (logEvent) => {
        return JSON.stringify(logFields(logEvent));
    };
});

const disableLog4js = {
    appenders: {
        console: { type: 'console' },
    },
    categories: {
        default: { appenders: ['console'], level: 'off' },
        off: { appenders: ['console'], level: 'off' },
    },
};

const enableLog4j = {
    appenders: {
        console: { type: 'console' },
        fileAppender: {
            type: 'file',
            filename: logLocation,
            maxLogSize: 10000,
            backups: 5,
            compress: true,
            layout: { type: 'json', separator: ',' },
        },
    },
    categories: {
        default: { appenders: ['fileAppender'], level: 'info' },
        production: { appenders: ['fileAppender'], level: 'info' },
        development: { appenders: ['console'], level: 'info' },
    },
    pm2: true,
};

if (process.env.DISABLE_LOGGING_AND_METRICS === "true") {
    configure(disableLog4js);
}
else {
    configure(enableLog4j);
}

// We do this to ensure no memory leaks during development as hot reloading
// doesn't clear up old listeners.
if (process.env.NODE_ENV === 'development') {
    shutdown((e) => {
        if (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
    });
}

export const logger =
    process.env.DISABLE_LOGGING_AND_METRICS === 'true'
        ? getLogger('off')
        : getLogger(process.env.NODE_ENV);
