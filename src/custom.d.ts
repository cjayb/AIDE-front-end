import { VueKeycloakInstance } from "@dsb-norge/vue-keycloak-js/dist/types";
import { mount } from "cypress/vue2";

declare module "vue/types/vue" {
    interface VueConstructor {
        $keycloak: VueKeycloakInstance;
        $window: Window & globalThis;
    }

    interface Vue {
        $keycloak: VueKeycloakInstance;
    }
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
        }
    }
}
