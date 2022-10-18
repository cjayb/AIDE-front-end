import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Vue from "vue";

export interface ErrorMessageMap {
    get?: string;
    post?: string;
    put?: string;
    patch?: string;
    delete?: string;
}

export function isResultOk({ status }: AxiosResponse): boolean {
    return status >= 200 && status <= 299;
}

export function authenticationEnabledInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
    if (process.env.VUE_APP_AUTH_ENABLED === "true") {
        Vue.prototype.$keycloak.keycloak.updateToken(70);
    }

    return config;
}

export function attachBearerTokenInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
    if (config.headers && Vue.prototype.$keycloak.token) {
        config.headers["Authorization"] = `Bearer ${Vue.prototype.$keycloak.token}`;
    }

    return config;
}

export function onRequestErrorInterceptor(
    error: AxiosError,
    messageMap: ErrorMessageMap,
): Promise<AxiosError> {
    if (error.code === "ERR_NETWORK") {
        Vue.$toast.error("Connection error. Please check your internet connection.");

        return Promise.reject(error);
    } else if (error.response?.status === 401) {
        Vue.prototype.$keycloak.logout({ redirectUri: `${window.location.origin}/#/` });

        return Promise.reject(error);
    }

    const messageKey = `${error.request.method}`.toLowerCase() as keyof ErrorMessageMap;
    const message = messageMap[messageKey] ?? "Something unexpected went wrong.";

    Vue.$toast.error(message);

    return Promise.reject(error);
}

export function createAxiosInstance(errorMessages?: ErrorMessageMap): AxiosInstance {
    const http = axios.create({
        baseURL: window.FRONTEND_API_HOST,
        headers: {
            "Content-Type": "application/json",
        },
    });

    http.interceptors.request.use((config) => authenticationEnabledInterceptor(config));
    http.interceptors.request.use((config) => attachBearerTokenInterceptor(config));
    http.interceptors.response.use(
        (response) => response,
        (error) => onRequestErrorInterceptor(error, errorMessages ?? {}),
    );

    return http;
}
