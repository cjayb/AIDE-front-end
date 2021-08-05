import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import AdminDashboard from "../views/AdminDashboard.vue";
import ClinicalReview from "../views/ClinicalReview.vue";
import Unauthorized from "../views/Unauthorized.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/admin-dashboard",
        name: "AdminDashboard",
        component: AdminDashboard,
        beforeEnter: (to, from, next) => {
            authenticated("admin", to, next);
        },
    },
    {
        path: "/clinical-review",
        name: "ClinicalReview",
        component: ClinicalReview,
        beforeEnter: (to, from, next) => {
            authenticated("clinician", to, next);
        },
    },
    {
        path: "/clinical-review/viewer/:study_id",
        name: "ClinicalReviewViewer",
        component: ClinicalReview,
        beforeEnter: (to, from, next) => {
            authenticated("clinician", to, next);
        },
    },
    {
        path: "/unauthorized",
        name: "Unauthorized",
        component: Unauthorized,
    },
    {
        path: "/",
        name: "Home",
        beforeEnter: (to, from, next) => {
            if (process.env.VUE_APP_AUTH_ENABLED == "true") {
                if (Vue.$keycloak.authenticated) {
                    if (Vue.$keycloak.hasResourceRole("admin")) {
                        Vue.$keycloak
                            .updateToken(70)
                            .then(() => {
                                next({ name: "AdminDashboard" });
                            })
                            .catch((err: any) => {
                                console.error(err);
                            });
                    } else if (Vue.$keycloak.hasResourceRole("clinician")) {
                        Vue.$keycloak
                            .updateToken(70)
                            .then(() => {
                                next({ name: "ClinicalReview" });
                            })
                            .catch((err: any) => {
                                console.error(err);
                            });
                    } else {
                        next({ name: "Unauthorized" });
                    }
                } else {
                    Vue.$keycloak.login({ redirectUri: `${window.location.origin}/#${to.path}` });
                }
            } else {
                next({ name: "AdminDashboard" });
            }
        },
    },
];

function authenticated(role: string, to: Route, next: NavigationGuardNext<Vue>) {
    if (process.env.VUE_APP_AUTH_ENABLED == "true") {
        if (Vue.$keycloak.authenticated) {
            if (Vue.$keycloak.hasResourceRole(role)) {
                Vue.$keycloak
                    .updateToken(70)
                    .then(() => {
                        next();
                    })
                    .catch((err: any) => {
                        console.error(err);
                    });
            } else {
                next({ name: "Unauthorized" });
            }
        } else {
            Vue.$keycloak.login({ redirectUri: `${window.location.origin}/#${to.path}` });
        }
    } else {
        next();
    }
}

const router = new VueRouter({
    routes,
});

export default router;
