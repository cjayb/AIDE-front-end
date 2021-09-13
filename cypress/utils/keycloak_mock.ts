let KeycloakMock = require("keycloak-mock");


//This doesn't work yet but I have left it here as a WIP for the login tests.

export class Keycloak {
    instance: any;
    activeMock: any;
    user: any;
    bearerToken: any;

    async MockKeycloak(){
        this.instance = await KeycloakMock.createMockInstance({
            authServerURL: "https://localhost:8443/auth",           
            realm: "aide",
            clientID: "aide-app"
        });
        this.activeMock = KeycloakMock.activateMock(this.instance);

        this.user = this.instance.database.createUser({
            name: "test",
            email: "testuser@test.com", // username will be email
            credentials: [{
                value: "Password01!",
            }],
        });

        console.log(this.user.profile, this.user.credentials);

        this.bearerToken = this.instance.createBearerToken(this.user.profile.id);
    }  
};
