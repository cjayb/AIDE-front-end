<template>
    <v-card :loading="loading">
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
            v-model="search"
            clearable
            @click:clear="clearSearch"
            data-cy="worklist-search"
        ></v-text-field>

        <!-- <v-divider></v-divider> -->

        <v-list dense nav style="height: calc(100vh - 323px); overflow-y: scroll">
            <v-list-item-group v-model="selectedItem">
                <v-list-item
                    v-for="item in filteredTasks"
                    :key="item.event.executions[0].execution_uid"
                    @click="selectTask(item)"
                    :active="false"
                    data-cy="worklist-item"
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
                            <span
                                >{{ item.model.model_name }} - {{ item.model.model_version }}</span
                            >
                        </v-tooltip>

                        <v-tooltip bottom open-delay="3000">
                            <template v-slot:activator="{ on, attrs }">
                                <v-list-item-subtitle v-bind="attrs" v-on="on"
                                    >Mode: {{ item.model.mode }}</v-list-item-subtitle
                                >
                            </template>
                            <span>{{ item.model.mode }}</span>
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
            </v-list-item-group>
        </v-list>
        <v-pagination
            :length="totalPages"
            :total-visible="2"
            :value="currentPage"
            :disabled="totalPages <= 1"
            @input="handlePageChange"
            data-cy="pagination"
        >
        </v-pagination>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { EventBus } from "@/event-bus";
import { getAllExecutionsPage } from "../../api/ExecutionService";

@Component({})
export default class Tasks extends Vue {
    tasks: Array<any> = [];
    search = "";
    selectedItem = 0;
    currentPage = 1;
    allTasks = 0;
    loading = false;
    from = 0;
    to = 10;

    async created(): Promise<void> {
        EventBus.$on("updateTaskList", () => {
            this.getNewTasks();
            this.selectedItem = 0;
        });

        EventBus.$emit("updateTaskList");
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
        this.$router.push({
            name: "ClinicalReviewViewer",
            params: { study_id: execution.event.origin.studyUID },
        });

        EventBus.$emit("selectTask", execution);
    }

    clearSearch() {
        this.search = "";
    }

    async getNewTasks() {
        this.loading = true;
        let response = await getAllExecutionsPage(String(this.from), String(this.to), "false");
        this.tasks = response.results;
        this.allTasks = response.total;
        if (this.tasks.length === 0) {
            EventBus.$emit("tasksNotEmpty", false);
        } else {
            EventBus.$emit("tasksNotEmpty", true);
        }
        let study_id = this.tasks[0].event.origin.studyUID;
        this.$router.push({ name: "ClinicalReviewViewer", params: { study_id: study_id } });
        this.selectTask(this.tasks[0]);
        this.loading = false;
    }

    handlePageChange(value: number) {
        if (value < this.currentPage) {
            this.to = this.from;
            this.from = this.from - 10;
        } else if (value > this.currentPage) {
            this.from = this.to;
            this.to = this.to + 10;
        }
        this.currentPage = value;
        EventBus.$emit("updateTaskList");
    }

    get totalPages(): number {
        return Math.ceil(this.allTasks / 10);
    }
}
</script>
