import Vue from "vue";
import axios from "axios";
import { ApplicationResult, Application, ApplicationDetail } from "@/models/ApplicationResult";

const http = axios.create({
    baseURL: window.FRONTEND_API_HOST,
    headers: {
        "Content-Type": "application/json",
    },
});

http.interceptors.request.use((config) => {
    Vue.$keycloak.updateToken(70);
    return config;
});

http.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (!!error.response && 401 === error.response?.status) {
            Vue.$keycloak.logout({ redirectUri: `${window.location.origin}/#/` });
        } else if (error.message == `Network Error` && !error.response) {
            Vue.$toast.error(`⚠ Connection error`);
        } else {
            Vue.$toast.error(`Something unexpected went wrong retrieving applications!`);
            return Promise.reject(error);
        }
    },
);

export async function getAllApplications(): Promise<ApplicationResult> {
    // TODO: Update to make actual API call
    http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    const response = await http.get(`/app_store/api/applications/`);
    return response.data;
}

export async function getApplication(
    application_id: string,
    application_version_id: string,
): Promise<ApplicationResult> {
    // TODO: Update to make actual API call
    // http.defaults.headers.common["Authorization"] = `Bearer ${Vue.$keycloak.token}`;
    // const response = await http.get(
    //     `/applications/${application_id}?application_version_id=${application_version_id}`,
    // );
    // return response.data;

    // Return Dummy data
    return {
        count: 0,
        next: 0,
        previous: 0,
        results: [
            {
                id: "application id 1",
                name: "Application Name",
                latest_version: "1.1",
                short_description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id pellentesque lectus.",
                image: "https://s3-alpha-sig.figma.com/img/6a25/2dae/524a6e02b386fd55eb65fe0e64628a19?Expires=1642377600&Signature=MX1omUM2~Rycyiuo5wOF83cUlmxuDG0YYFb5OFgWkEABpWXe5E9ooasi~An9mCPTc060FGjusBxNRWl5OdNgjV-6oKSq1bEovC65SOkX6TzYEsi66NqW9lqoFbr9Uzsbzoa6xNjXZPcpAEvjRc8KuvhtNJFjfq4N6IW6W31at4sfQHnYwPmNI9GvIq48fzsBzw7qXrueFJY65h7qGr2ZNbGnIFSFqKYPDSVrfg6hjEr5T5GZ3LJDCMHAYdqEBd5hiYsEH38lN3uaK5~N0Jud8xgc1zKGg6qHdPHj7LC7tnNg8Rbtn5lqiTDaT-MrHGH7fkWm2PIymSO32J1WJfmI~A__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
                medical_specialties: ["Radiology"],
                certification: { certifications: ["ce", "fda", "ukca"], certification_details: "" },
                developer_details: "developer_details",
                developers: "developers",
                collaborators: ["collaborators"],
            },
        ],
    };
}
