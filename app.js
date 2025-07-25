import dotenv from 'dotenv';

dotenv.config();

const envVarsList = [
    'PORT',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'INSTANCE_CONNECTION_NAME'
]

const missingVars = envVarsList.filter((key) => !process.env[key]);

if(missingVars.length > 0) {
    console.log(
        `❌ missing required environment values: ${missingVars.join(",")}`
    );
    process.exit(1);
}

