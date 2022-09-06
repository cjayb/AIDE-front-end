import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import AdminHealthDashboard from "@/views/AdminHealthDashboard.vue";
import AdminPayloadDashboard from "@/views/AdminPayloadDashboard.vue";
import ClinicalReview from "@/views/ClinicalReview.vue";
import AppRepo from "@/views/AppRepo.vue";
import ListView from "@/components/AppRepo/ListView/ListView.vue";
import DetailView from "@/components/AppRepo/DetailView/DetailView.vue";
import Unauthorized from "@/views/Unauthorized.vue";
import UserManagement from "@/views/UserManagement.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/admin-health-dashboard",
        name: "AdminHealthDashboard",
        component: AdminHealthDashboard,
        beforeEnter: (to, from, next) => {
            authenticated("admin", to, next);
        },
    },
    {
        path: "/admin-payload-dashboard",
        name: "AdminPayloadDashboard",
        component: AdminPayloadDashboard,
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
        path: "/user-management",
        name: "UserManagement",
        component: UserManagement,
        beforeEnter: (to, from, next) => {
            authenticated("admin", to, next);
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
        beforeEnter: async (to, from, next) => {
            if (process.env.VUE_APP_AUTH_ENABLED !== "true") {
                return next({ name: "AdminHealthDashboard" });
            }

            if (!Vue.$keycloak.authenticated) {
                Vue.$keycloak.login({ redirectUri: `${window.location.origin}/#${to.path}` });
            }

            let destination = "Unauthorized";

            if (Vue.$keycloak.hasResourceRole("admin")) {
                const result = await Vue.$keycloak.updateToken(70);

                if (result) {
                    destination = "AdminHealthDashboard";
                }
            } else if (Vue.$keycloak.hasResourceRole("clinician")) {
                const result = await Vue.$keycloak.updateToken(70);

                if (result) {
                    destination = "ClinicalReview";
                }
            } else if (Vue.$keycloak.hasResourceRole("deployer")) {
                const result = await Vue.$keycloak.updateToken(70);

                if (result) {
                    destination = "ApplicationRepositoryList";
                }
            }

            return next({ name: destination });
        },
    },
];

function authenticated(role: string, to: Route, next: NavigationGuardNext<Vue>) {
    if (process.env.VUE_APP_AUTH_ENABLED !== "true") {
        return next();
    }

    if (!Vue.$keycloak.authenticated) {
        Vue.$keycloak.login({ redirectUri: `${window.location.origin}/#${to.path}` });

        return;
    }

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
}

const router = new VueRouter({
    routes,
});

export default router;
