<template>
    <v-dialog
        :retain-focus="retainFocus"
        :persistent="persistent"
        :value="value"
        @input="valueChanged"
        max-width="350px"
    >
        <v-card class="pa-6" rounded="lg">
            <v-card-title class="justify-center">{{ title }}</v-card-title>
            <v-card-text class="grey--text text-center text--darken-3">
                <slot></slot>
            </v-card-text>
            <v-card-actions class="justify-center">
                <v-btn
                    class="secondary-button mx-2"
                    text
                    :data-cy="`${dataCyPrefix}-cancel`"
                    @click="cancelAction"
                >
                    {{ cancelBtnText }}
                    <v-icon right> mdi-close </v-icon>
                </v-btn>
                <v-btn
                    :class="deletionModal === true ? 'alert-button mx-2' : 'primary-button mx-2'"
                    text
                    :data-cy="`${dataCyPrefix}-continue`"
                    @click="continueAction"
                >
                    {{ continueBtnText }}
                    <v-icon right> mdi-check-circle-outline </v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class ConfirmationModal extends Vue {
    @Prop({ default: "", required: true })
    dataCyPrefix!: string;

    @Prop({ default: false })
    persistent!: boolean;

    @Prop({ default: "Confirm" })
    title!: string;

    @Prop({ default: "Cancel" })
    cancelBtnText!: string;

    @Prop({ default: "Yes" })
    continueBtnText!: string;

    @Prop({ default: false })
    value!: boolean;

    @Prop({ default: false })
    deletionModal?: boolean;

    @Prop({ default: false })
    retainFocus?: boolean;

    cancelAction() {
        this.$emit("cancel");
    }

    continueAction() {
        this.$emit("continue");
    }

    valueChanged(ev: any) {
        this.$emit("changeValue", ev);
    }
}
</script>
