<template>
    <v-dialog transition="dialog-bottom-transition" max-width="600" v-model="dialog2">
        <template v-slot:default="dialog2">
            <v-card>
                <v-toolbar color="#61366e" dark>Log Viewer</v-toolbar>
                <v-card-text>
                    <div>logs</div>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn text @click="dialog2.value = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";

@Component({})
export default class LogsDialog extends Vue {
    dialog2 = false;

    created(): void {
        EventBus.$on("openLogsDialog", (dialog2: boolean) => {
            this.dialog2 = dialog2;
        });
    }
}
</script>
