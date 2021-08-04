import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
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
            const basePath = window.location.toString();
            if (Vue.$keycloak.authenticated) {
                if (Vue.$keycloak.hasResourceRole("admin")) {
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
                Vue.$keycloak.login({ redirectUri: basePath.slice(0, -1) + to.path });
            }
        },
    },
    {
        path: "/clinical-review",
        name: "ClinicalReview",
        component: ClinicalReview,
        beforeEnter: (to, from, next) => {
            const basePath = window.location.toString();
            if (Vue.$keycloak.authenticated) {
                if (Vue.$keycloak.hasResourceRole("clinician")) {
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
                Vue.$keycloak.login({ redirectUri: basePath.slice(0, -1) + to.path });
            }
        },
    },
    {
        path: "/clinical-review/viewer/:study_id",
        name: "ClinicalReviewViewer",
        component: ClinicalReview,
        beforeEnter: (to, from, next) => {
            const basePath = window.location.toString();
            if (Vue.$keycloak.authenticated) {
                if (Vue.$keycloak.hasResourceRole("clinician")) {
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
                Vue.$keycloak.login({ redirectUri: basePath.slice(0, -1) + to.path });
            }
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
            const basePath = window.location.toString();
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
                }
                if (Vue.$keycloak.hasResourceRole("clinician")) {
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
                Vue.$keycloak.login({ redirectUri: basePath.slice(0, -1) + to.path });
            }
        },
    },
];

const router = new VueRouter({
    routes,
});

export default router;
