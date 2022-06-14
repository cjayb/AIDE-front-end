import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import AdminHealthDashboard from "../views/AdminHealthDashboard.vue";
import AdminPayloadDashboard from "../views/AdminPayloadDashboard.vue";
import ClinicalReview from "../views/ClinicalReview.vue";
import AppRepo from "../views/AppRepo.vue";
import ListView from "../components/AppRepo/ListView/ListView.vue";
import DetailView from "../components/AppRepo/DetailView/DetailView.vue";
import Unauthorized from "../views/Unauthorized.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/admin-health-dashboard",
        name: "AdminHealthDashboard",
        component: AdminHealthDashboard,
        // beforeEnter: (to, from, next) => {
        //     authenticated("admin", to, next);
        // },
    },
    {
        path: "/admin-payload-dashboard",
        name: "AdminPayloadDashboard",
        component: AdminPayloadDashboard,
        // beforeEnter: (to, from, next) => {
        //     authenticated("admin", to, next);
        // },
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
        path: "/application-repository",
        component: AppRepo,
        children: [
            {
                path: "",
                name: "ApplicationRepositoryList",
                component: ListView,
                meta: {
                    breadCrumb: [
                        {
                            text: "Application Repository",
                        },
                    ],
                },
            },
            {
                path: ":application_id",
                name: "ApplicationRepositoryDetail",
                component: DetailView,
                meta: {
                    breadCrumb(route: Route) {
                        const application_id = route.params.application_id;
                        return [
                            {
                                text: "Application Repository",
                                to: { name: "ApplicationRepositoryList" },
                            },
                            {
                                text: application_id,
                            },
                        ];
                    },
                },
            },
        ],
        beforeEnter: (to, from, next) => {
            authenticated("deployer", to, next);
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
                                next({ name: "AdminHealthDashboard" });
                            })
                            .catch((err: Error) => {
                                console.error(err);
                            });
                    } else if (Vue.$keycloak.hasResourceRole("clinician")) {
                        Vue.$keycloak
                            .updateToken(70)
                            .then(() => {
                                next({ name: "ClinicalReview" });
                            })
                            .catch((err: Error) => {
                                console.error(err);
                            });
                    } else if (Vue.$keycloak.hasResourceRole("deployer")) {
                        Vue.$keycloak
                            .updateToken(70)
                            .then(() => {
                                next({ name: "ApplicationRepositoryList" });
                            })
                            .catch((err: Error) => {
                                console.error(err);
                            });
                    } else {
                        next({ name: "Unauthorized" });
                    }
                } else {
                    Vue.$keycloak.login({ redirectUri: `${window.location.origin}/#${to.path}` });
                }
            } else {
                next({ name: "AdminHealthDashboard" });
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
                    .catch((err: Error) => {
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
