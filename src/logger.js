import winston from 'winston';
import config from "../src/config/config.js"

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white',
    }
}


const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level: 'warn',
            format: winston.format.simple()
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level: 'warn',
            format: winston.format.simple()
        })
    ]
})


export const addLogger = (req, res, next) => {
    if (config.loggerEnv === 'dev') {
        req.logger = devLogger;
    } else if (config.loggerEnv === 'prod') {
        req.logger = prodLogger;
    }
    next();
}
