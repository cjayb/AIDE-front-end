<template>
    <v-container class="pa-0">
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
        ></v-text-field>

        <!-- <v-divider></v-divider> -->

        <v-list dense nav>
            <v-list-item
                v-for="item in filteredTasks"
                :key="item.execution_uid"
                link
                @click="selectTask(item)"
                :to="{
                    name: 'ClinicalReviewViewer',
                    params: { study_id: item.output.destinations[0].study.study_uid },
                }"
            >
                <v-list-item-content>
                    <v-list-item-title>
                        <!-- Patient: -->
                        {{
                            item.output.destinations[0].study.series[0].metadata.PatientsName
                        }}</v-list-item-title
                    >
                    <v-list-item-subtitle>{{ item.model.model_name }}</v-list-item-subtitle>
                    <v-list-item-subtitle>
                        <!-- Received: -->
                        {{ item.timestamp.inference_finished | formatDate }}</v-list-item-subtitle
                    >
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-container>
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
        this.tasks = await getAllExecutions("1", "10", "false");
        let study_id = this.tasks[0].output.destinations[0].study.study_uid;
        this.$router.push({ name: "ClinicalReviewViewer", params: { study_id: study_id } });
        this.selectTask(this.tasks[0]);
    }

    get filteredTasks() {
        return this.tasks.filter((item) => {
            if (!this.search) return this.tasks;
            return item.output.destinations[0].study.series[0].metadata.PatientsName.toLowerCase().includes(
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
