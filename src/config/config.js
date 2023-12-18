import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    mongoUrlTesting: process.env.MONGO_URL_TESTING,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    persistence: process.env.PERSISTENCE,
    loggerEnv: process.env.LOGGER_ENVIRONMENT,
    privateKey: process.env.PRIVATE_KEY,
    transportUser: process.env.TRANSPORT_USER
};
