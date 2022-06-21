<template>
    <v-dialog transition="dialog-bottom-transition" max-width="60vw" v-model="dialog2">
        <template v-slot:default="dialog2">
            <v-card>
                <div v-show="loading" class="pa-1 pb-2">
                    Please Wait...
                    <v-progress-linear indeterminate color="blue" class=""></v-progress-linear>
                </div>
                <div v-show="!loading && logs.length > 0">
                    <v-toolbar color="#61366e" dark>Log Viewer</v-toolbar>
                    <v-card-text style="height: 60vh; overflow: scroll !important" data-cy="logs">
                        <vue-json-pretty
                            :path="'res'"
                            :data="logs"
                            :customValueFormatter="customKeyFormatter"
                            showLine
                            data-cy="execution-logs"
                        >
                        </vue-json-pretty>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                        <v-btn text @click="downloadFile">Download Logs</v-btn>
                        <v-btn text @click="dialog2.value = false">Close</v-btn>
                    </v-card-actions>
                </div>
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
import { getTaskLogs } from "@/api/Admin/AdminStatisticsService";

@Component({
    components: { VueJsonPretty },
})
export default class LogsDialog extends Vue {
    dialog2 = false;
    loading = true;
    executionId: string | undefined = "";
    logs: any;

    created(): void {
        EventBus.$on(
            "openLogsDialog",
            async (dialog2: boolean, task_id?: number, execution_uid?: string) => {
                this.loading = true;
                this.logs = "";
                this.dialog2 = dialog2;

                if (typeof execution_uid !== "undefined") {
                    this.executionId = execution_uid;

                    await getLogs(execution_uid)
                        .then((log) => {
                            this.logs = log;
                        })
                        .catch((err) => {
                            this.dialog2 = false;
                            this.loading = false;
                        });
                }
                if (typeof task_id !== "undefined") {
                    await getTaskLogs(task_id)
                        .then((log) => {
                            this.logs = log;
                        })
                        .catch((err) => {
                            this.dialog2 = false;
                            this.loading = false;
                        });
                }

                this.loading = false;
            },
        );
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
        return `<span style="color: #00AA00">${key}<span>`;
    }
}
</script>

<style>
.v-toast__text {
    font-family: "Open Sans", sans-serif !important;
}
</style>
