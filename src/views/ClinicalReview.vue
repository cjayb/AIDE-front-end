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
    <v-container style="max-width: 100%" fluid>
        <Header />
        <v-row>
            <!-- Task List -->
            <v-col cols="2">
                <Tasks />
            </v-col>
            <!-- Viewer -->
            <v-col cols="10" v-if="tasksNotEmpty">
                <!-- <Header /> -->
                <v-card
                    style="
                        width: 100%;
                        height: calc(100vh - 164px);
                        overflow: hidden;
                        background: black;
                    "
                    class="my-4"
                >
                    <v-row>
                        <transition name="fade" mode="out-in">
                            <v-col cols="12" :key="$route.path">
                                <CustomDicomViewer :key="$route.path" />
                            </v-col>
                        </transition>
                    </v-row>
                </v-card>
            </v-col>
            <v-col v-else>
                <EmptyTaskList />
            </v-col>
        </v-row>

        <ApprovalDialog />
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CustomDicomViewer from "../components/ClinicalReview/DicomViewer/CustomDicomViewer.vue";
import Header from "../components/ClinicalReview/Header.vue";
import Tasks from "../components/ClinicalReview/Tasks.vue";
import ApprovalDialog from "../components/ClinicalReview/ApprovalDialog.vue";
import EmptyTaskList from "../views/EmptyTaskList.vue";
import { EventBus } from "@/event-bus";

@Component({
    components: {
        CustomDicomViewer,
        Header,
        Tasks,
        ApprovalDialog,
        EmptyTaskList,
    },
})
export default class ClinicalReview extends Vue {
    tasksNotEmpty = true;
    created(): void {
        EventBus.$on("tasksNotEmpty", (tasksEmpty: boolean) => {
            this.tasksNotEmpty = tasksEmpty;
        });
    }
}
</script>

<style scoped>
.header-title {
    /* font-family: Bai Jamjuree; */
    font-style: normal;
    font-weight: 300;
    font-size: 34px;
    line-height: 40px;
    /* identical to box height, or 118% */

    letter-spacing: 0.0025em;

    color: #000000;
}
</style>
