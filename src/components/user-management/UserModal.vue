<template>
    <v-card>
        <v-card-title class="text-h5"
            ><span v-if="editing">Edit&nbsp;</span>User Details</v-card-title
        >
        <div class="px-4">
            <v-form v-model="requiredFieldsFilled" ref="form">
                <div>
                    <span class="font-weight-medium mb-2 required">First Name</span>
                    <v-text-field
                        outlined
                        dense
                        validate-on-blur
                        label="First Name"
                        data-cy="user-first-name"
                        v-model="firstName"
                        :rules="requiredTextRules"
                    ></v-text-field>
                </div>
                <div>
                    <span class="font-weight-medium mb-2 required">Last Name</span>
                    <v-text-field
                        outlined
                        dense
                        validate-on-blur
                        label="Last Name"
                        data-cy="user-last-name"
                        v-model="lastName"
                        :rules="requiredTextRules"
                    ></v-text-field>
                </div>
                <div>
                    <span class="font-weight-medium mb-2 required">Email</span>
                    <v-text-field
                        outlined
                        dense
                        validate-on-blur
                        label="Email"
                        type="email"
                        data-cy="user-email"
                        v-model="email"
                        :rules="emailRules"
                    ></v-text-field>
                </div>
                <div>
                    <span class="font-weight-medium mb-2 required">Roles</span>
                    <v-select
                        outlined
                        dense
                        multiple
                        hidden
                        validate-on-blur
                        return-object
                        label="Roles"
                        item-text="name"
                        data-cy="user-roles"
                        v-model="realmRoles"
                        :menu-props="{ contentClass: 'user-role' }"
                        :items="roles"
                        :rules="oneOrMoreRules"
                    ></v-select>
                </div>
            </v-form>
        </div>
        <v-divider />
        <v-card-actions class="px-4 justify-end">
            <v-btn text data-cy="user-modal-discard" @click="discard">Discard</v-btn>
            <v-btn
                text
                data-cy="user-modal-save"
                color="primary"
                @click="save"
                :disabled="!requiredFieldsFilled"
            >
                <span v-if="user.id">Save</span>
                <span v-else>Add user</span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { InputValidationRules } from "vuetify";
import { emailRegEx } from "@/utils/constants";
import { UserListItem, UserRoleListItem } from "@/models/user-management/UserManagement";

@Component({
    computed: {
        editing(): boolean {
            return !!this.$props.user?.id;
        },
        firstName: {
            get() {
                return this.$props.user?.firstName;
            },
            set(value: string) {
                this.$data.userDetails.firstName = value;
            },
        },
        lastName: {
            get() {
                return this.$props.user?.lastName;
            },
            set(value: string) {
                this.$data.userDetails.lastName = value;
            },
        },
        email: {
            get() {
                return this.$props.user?.email;
            },
            set(value: string) {
                this.$data.userDetails.email = value;
            },
        },
        realmRoles: {
            get() {
                return this.$props.user?.realmRoles || [];
            },
            set(value: string) {
                this.$data.userDetails.realmRoles = value;
            },
        },
    },
})
export default class UserModal extends Vue {
    @Prop({ default: () => [] })
    roles!: UserRoleListItem[];

    @Prop()
    user?: UserListItem;

    requiredTextRules: InputValidationRules = [(value) => !!value || "Required"];
    oneOrMoreRules: InputValidationRules = [
        (value: string[]) => !!value.length || "Select one or more",
    ];
    emailRules: InputValidationRules = [
        (value) => !!value || "Required",
        (value) => emailRegEx.test(value) || "Invalid email address",
    ];
    requiredFieldsFilled = false;
    userDetails = {} as UserListItem;

    resetForm() {
        this.userDetails = {} as UserListItem;
        (this.$refs.form as any)?.reset();
        (this.$refs.form as any)?.resetValidation();
    }

    discard() {
        this.$emit("discard");
        this.resetForm();
    }

    save() {
        const user = { ...(this.user || {}), ...this.userDetails };
        this.$emit("save", user);
    }
}
</script>