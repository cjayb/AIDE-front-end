import { KeycloakInstance } from "keycloak-js";
import Vue from "vue";

declare module "vue/types/vue" {
    interface VueConstructor {
        $keycloak: KeycloakInstance;
        $window: Window & globalThis;
    }
}
