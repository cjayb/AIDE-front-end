<template>
    <v-card>
        <v-card-title><span v-if="editing">Edit&nbsp;</span>DICOM Configuration</v-card-title>
        <div class="px-4">
            <v-form v-model="requiredFieldsFilled" ref="form">
                <div>
                    <span class="font-weight-medium mb-2 required">Name</span>
                    <v-text-field
                        outlined
                        dense
                        label="Name"
                        data-cy="destination-name"
                        v-model="name"
                        :disabled="editing"
                        :rules="requiredTextRules"
                    ></v-text-field>
                </div>

                <div>
                    <span class="font-weight-medium mb-2 required">AE Title</span>
                    <v-text-field
                        outlined
                        dense
                        label="AE Title"
                        data-cy="destination-ae-title"
                        v-model="aeTitle"
                        :rules="requiredTextRules"
                    ></v-text-field>
                </div>

                <div>
                    <span class="font-weight-medium mb-2 required">Address</span>
                    <v-text-field
                        outlined
                        dense
                        label="Address"
                        data-cy="destination-ip-address"
                        v-model="hostIp"
                        :rules="ipAddressRules"
                    ></v-text-field>
                </div>

                <div>
                    <span class="font-weight-medium mb-2 required">Port</span>
                    <v-text-field
                        outlined
                        dense
                        type="number"
                        label="Port"
                        data-cy="destination-port"
                        v-model="port"
                        :rules="portRules"
                    ></v-text-field>
                </div>
            </v-form>
        </div>
        <v-divider />
        <v-card-actions class="px-4 justify-end">
            <v-btn
                text
                class="secondary-button"
                data-cy="destination-create-cancel"
                @click="discard"
            >
                Cancel
                <v-icon right> mdi-close </v-icon>
            </v-btn>
            <v-btn
                text
                :class="!requiredFieldsFilled ? 'secondary-button' : 'primary-button'"
                data-cy="destination-create-save"
                @click="save"
                :disabled="!requiredFieldsFilled"
            >
                Save
                <v-icon small right> mdi-content-save </v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { InputValidationRules } from "vuetify";
import { IExportDestination } from "@/models/export-destinations/ExportDestination";

@Component({
    computed: {
        editing(): boolean {
            return !!this.$props.destination?.name;
        },
        name: {
            get() {
                return this.$props.destination?.name;
            },
            set(value: string) {
                this.$data.destinationDetails.name = value;
            },
        },
        aeTitle: {
            get() {
                return this.$props.destination?.aeTitle;
            },
            set(value: string) {
                this.$data.destinationDetails.aeTitle = value;
            },
        },
        hostIp: {
            get() {
                return this.$props.destination?.hostIp;
            },
            set(value: string) {
                this.$data.destinationDetails.hostIp = value;
            },
        },
        port: {
            get() {
                return this.$props.destination?.port;
            },
            set(value: string) {
                this.$data.destinationDetails.port = value;
            },
        },
    },
})
export default class ConfigurationModal extends Vue {
    @Prop()
    destination?: IExportDestination;

    requiredFieldsFilled = false;
    destinationDetails = {} as IExportDestination;

    requiredTextRules: InputValidationRules = [(value: string) => !!value || "Required"];

    // https://stackoverflow.com/a/106223
    ipAddressRules: InputValidationRules = [
        ...this.requiredTextRules,
        (value: string) =>
            /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(
                value,
            ) ||
            /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/.test(
                value,
            ) ||
            "Invalid address",
    ];
    portRules: InputValidationRules = [
        ...this.requiredTextRules,
        (value: number) => value > 0 || "Invalid port",
    ];

    private resetForm() {
        (this.$refs.form as any).reset();
        (this.$refs.form as any).resetValidation();
    }

    discard() {
        this.resetForm();
        this.$emit("discard");
    }

    save() {
        const dest = { ...(this.destination || {}), ...this.destinationDetails };
        this.$emit("save", dest);
    }
}
</script>
