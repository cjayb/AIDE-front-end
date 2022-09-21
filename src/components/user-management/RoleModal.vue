<template>
    <v-card>
        <v-card-title class="text-h5">
            <span v-if="editing">Edit&nbsp;</span>
            Role Details
        </v-card-title>
        <div class="px-6">
            <v-form v-model="requiredFieldsFilled">
                <div>
                    <span class="font-weight-medium mb-2 required">Name</span>
                    <v-text-field
                        outlined
                        dense
                        label="Name"
                        data-cy="role-name"
                        v-model="name"
                        :rules="requiredTextRules"
                    ></v-text-field>
                </div>
            </v-form>
        </div>
        <v-divider />
        <v-card-actions class="px-4 justify-end">
            <v-btn text data-cy="role-modal-discard" @click="discard">Discard</v-btn>
            <v-btn
                text
                data-cy="role-modal-save"
                color="primary"
                @click="save"
                :disabled="!requiredFieldsFilled"
            >
                <span v-if="role.id">Save</span>
                <span v-else>Add role</span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { UserRoleListItem } from "@/models/user-management/UserManagement";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { InputValidationRules } from "vuetify";

@Component({
    computed: {
        editing(): boolean {
            return !!this.$props.role?.id;
        },
        name: {
            get() {
                return this.$props.role?.name;
            },
            set(value: string) {
                this.$data.roleName = value;
            },
        },
    },
})
export default class RoleModal extends Vue {
    @Prop()
    role?: UserRoleListItem;

    requiredFieldsFilled = false;
    requiredTextRules: InputValidationRules = [(value) => !!value || "Required"];
    roleName = "";

    discard() {
        this.$emit("discard");
    }

    save() {
        const role = { ...(this.role || {}) };
        role.name = this.roleName;

        this.$emit("save", role);
    }
}
</script>
