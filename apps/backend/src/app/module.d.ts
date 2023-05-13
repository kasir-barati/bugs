/* eslint-disable @typescript-eslint/no-unused-vars */

namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV?: string;
        DATABASE_URL: string;
        APP_PORT: string;
        APP_EXPOSED_PORT: string;
        APP_HOST: string;
        BASE_URL?: string;
        SWAGGER_PATH?: string;
        KEYCLOAK_AUTHORIZATION_SERVER_URL: string;
        KEYCLOAK_CLIENT_ID: string;
        KEYCLOAK_SECRET: string;
        KEYCLOAK_REALM: string;
    }
}
