<template>
    <v-dialog transition="dialog-bottom-transition" max-width="60vw" v-model="dialog2">
        <template v-slot:default="dialog2">
            <v-card>
                <v-toolbar color="#61366e" dark>Log Viewer</v-toolbar>
                <v-card-text style="height: 60vh; overflow: scroll !important">
                    <vue-json-pretty
                        :path="'res'"
                        :data="logs"
                        :customValueFormatter="customKeyFormatter"
                        showLine
                    >
                    </vue-json-pretty>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn text @click="downloadFile">Download Logs</v-btn>
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
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { getLogs } from "../../api/LogService";

@Component({
    components: { VueJsonPretty },
})
export default class LogsDialog extends Vue {
    dialog2 = false;
    executionId = "";
    logs = "No logs found";

    created(): void {
        EventBus.$on("openLogsDialog", async (dialog2: boolean, execution_uid: string) => {
            this.executionId = execution_uid;
            this.dialog2 = dialog2;
            this.logs = await getLogs(execution_uid);
        });
    }

    downloadFile(): void {
        const data = JSON.stringify(this.logs);

        const blob = new Blob([data], { type: "text/plain" });
        const e = document.createEvent("MouseEvents"),
            a = document.createElement("a");
        a.download = `${this.executionId}.json`;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
        e.initEvent("click", true, false);
        a.dispatchEvent(e);
        a.remove();
    }

    customKeyFormatter(key: any, path: any) {
        console.log(key);

        return `<p style="color: #0e844e">${key}<p>`;
    }
}
</script>
