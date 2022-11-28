export {};

declare global {
    interface Window {
        FRONTEND_API_HOST: string;
        ORTHANC_API_URL: string;
        KEYCLOAK_URL: string;
        WADO_URI_ROOT: string;
        QIDO_ROOT: string;
        WADO_ROOT: string;
    }
}
