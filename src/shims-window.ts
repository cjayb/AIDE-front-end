export {};

declare global {
    interface Window {
        FRONTEND_API_HOST: string;
        KEYCLOAK_URL: string;
    }
}
