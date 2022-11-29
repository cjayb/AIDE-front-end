<!--
  Copyright 2022 Guy’s and St Thomas’ NHS Foundation Trust

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
  -->

<template>
    <v-card :loading="loading" elevation="0" class="my-0">
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
                <transition-group name="list" tag="v-list-item">
                    <v-list-item
                        v-for="item in filteredTasks"
                        :key="item.event.executions[0].execution_uid"
                        @click="selectTask(item)"
                        :active="false"
                        data-cy="worklist-item"
                        class="list-item"
                    >
                        <v-list-item-content>
                            <v-tooltip bottom open-delay="3000">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-list-item-title v-bind="attrs" v-on="on">
                                        {{
                                            item.event.origin.series[0].PatientName
                                        }}</v-list-item-title
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
                                    >{{ item.model.model_name }} -
                                    {{ item.model.model_version }}</span
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
                </transition-group>
            </v-list-item-group>
        </v-list>
        <v-pagination
            :length="totalPages"
            :total-visible="0"
            :value="currentPage"
            :disabled="totalPages <= 1 && currentPage == 1"
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
import { getAllExecutionsPage } from "../../api/ClinicalReview/ExecutionService";
import { ExecutionPage } from "@/models/ClinicalReview/Execution";
import { RawLocation } from "vue-router";

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
        EventBus.$on("updateTaskList", (idToRemove?: string) => {
            this.getNewTasks(idToRemove);
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
        let routeObj: RawLocation = {
            name: execution ? "ClinicalReviewViewer" : "ClinicalReview",
        };

        if (execution) {
            routeObj = {
                ...routeObj,
                params: { study_id: execution.event.origin.studyUID },
            };
        }

        this.$router.push(routeObj);
        EventBus.$emit("selectTask", execution);
    }

    clearSearch() {
        this.search = "";
    }

    async getNewTasks(idToRemove?: string) {
        this.loading = true;
        await getAllExecutionsPage(String(this.from), String(this.to), "false")
            .then((response) => {
                this.setTaskList(response, idToRemove);
                this.allTasks = response.total;
                const tasksNotEmpty = this.tasks.length > 0;
                EventBus.$emit("tasksNotEmpty", tasksNotEmpty);

                const taskToSelect = tasksNotEmpty ? this.tasks[0] : null;
                this.selectTask(taskToSelect);
            })
            .catch(() => EventBus.$emit("tasksNotEmpty", false))
            .finally(() => (this.loading = false));
    }

    setTaskList(response: ExecutionPage, idToRemove?: string) {
        if (idToRemove !== undefined) {
            response.results.forEach((result) => {
                const index = this.tasks.findIndex(
                    (ex) => ex.model.execution_uid == result.model.execution_uid,
                );
                index === -1 && this.tasks.push(result);
            });
            const removeIndex = this.tasks.findIndex((ex) => ex.model.execution_uid == idToRemove);
            this.tasks.splice(removeIndex, 1);

            if (this.allTasks > 0 && this.tasks.length == 0) {
                this.currentPage--;
                this.to = this.from;
                this.from = this.from - 10;
                EventBus.$emit("updateTaskList");
            }
        } else {
            this.tasks = response.results;
        }
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

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(30px);
}
</style>
