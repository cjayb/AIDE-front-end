<template>
    <v-dialog :persistent="persistent" :value="value" @input="valueChanged" max-width="350px">
        <v-card>
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text class="grey--text text--darken-3">
                <slot></slot>
            </v-card-text>
            <v-card-actions class="px-4 justify-end">
                <v-btn text :data-cy="`${dataCyPrefix}-cancel`" @click="cancelAction">
                    {{ cancelBtnText }}
                </v-btn>
                <v-btn
                    text
                    :data-cy="`${dataCyPrefix}-continue`"
                    color="red darken-2"
                    @click="continueAction"
                >
                    {{ continueBtnText }}
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
