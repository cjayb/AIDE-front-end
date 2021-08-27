<template>
    <v-card>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title class="text-h6">Work List</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-text-field
            outlined
            dense
            class="pa-2"
            label="Search Tasks"
            placeholder="Search Tasks"
            data-test="search-tasks-input"
            v-model="search"
            clearable
            @click:clear="clearSearch"
        ></v-text-field>

        <!-- <v-divider></v-divider> -->

        <v-list dense nav style="height: 83vh; overflow-y: scroll">
            <v-list-item
                v-for="item in filteredTasks"
                :key="item.event.executions[0].execution_uid"
                link
                @click="selectTask(item)"
                :to="{
                    name: 'ClinicalReviewViewer',
                    params: { study_id: item.event.origin.studyUID },
                }"
                data-test="work-list-item"
            >
                <v-list-item-content>
                    <v-tooltip bottom open-delay="3000">
                        <template v-slot:activator="{ on, attrs }">
                            <v-list-item-title v-bind="attrs" v-on="on">
                                {{ item.event.origin.series[0].PatientName }}</v-list-item-title
                            >
                        </template>
                        <span>{{ item.event.origin.series[0].PatientName }}</span>
                    </v-tooltip>
                    <v-tooltip bottom open-delay="3000">
                        <template v-slot:activator="{ on, attrs }">
                            <v-list-item-subtitle v-bind="attrs" v-on="on"
                                >{{ item.model.model_name }} -
                                {{ item.model.model_version }}</v-list-item-subtitle
                            >
                        </template>
                        <span>{{ item.model.model_name }} - {{ item.model.model_version }}</span>
                    </v-tooltip>

                    <v-tooltip bottom open-delay="3000">
                        <template v-slot:activator="{ on, attrs }">
                            <v-list-item-subtitle v-bind="attrs" v-on="on">
                                Received:
                                {{
                                    item.timestamp.inference_finished | formatDate
                                }}</v-list-item-subtitle
                            >
                        </template>
                        <span>{{ item.timestamp.inference_finished | formatDate }}</span>
                    </v-tooltip>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import { getAllExecutions } from "../../api/ExecutionService";

@Component({})
export default class Tasks extends Vue {
    tasks: Array<any> = [];
    search = "";

    async created(): Promise<void> {
        EventBus.$on("updateTaskList", (selectedTask: string) => {
            var updatedList = this.tasks.filter(
                (item) => item.model.execution_uid !== selectedTask,
            );
            this.tasks = updatedList;
            if (this.tasks.length === 0) {
                EventBus.$emit("tasksNotEmpty", false);
            } else {
                this.selectTask(this.tasks[0]);
            }
        });
        this.tasks = await getAllExecutions("1", "10", "false");
        if (this.tasks.length === 0) {
            EventBus.$emit("tasksNotEmpty", false);
        } else {
            EventBus.$emit("tasksNotEmpty", true);
        }
        let study_id = this.tasks[0].event.origin.studyUID;
        this.$router.push({ name: "ClinicalReviewViewer", params: { study_id: study_id } });
        this.selectTask(this.tasks[0]);
    }

    get filteredTasks() {
        return this.tasks.filter((item) => {
            if (!this.search) return this.tasks;
            return item.event.origin.series[0].PatientName.toLowerCase().includes(
                this.search.toLowerCase(),
            );
        });
    }

    selectTask(execution: any): void {
        EventBus.$emit("selectTask", execution);
    }

    clearSearch() {
        this.search = "";
    }
}
</script>
