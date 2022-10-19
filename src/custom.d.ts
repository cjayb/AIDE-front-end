import { VueKeycloakInstance } from "@dsb-norge/vue-keycloak-js/dist/types";

declare module "vue/types/vue" {
    interface VueConstructor {
        $keycloak: VueKeycloakInstance;
        $window: Window & globalThis;
    }

    interface Vue {
        $keycloak: VueKeycloakInstance;
    }
}
