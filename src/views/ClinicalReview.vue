<template>
    <v-container style="max-width: 100%" fluid>
        <v-row>
            <!-- Task List -->
            <v-col cols="2">
                <Tasks />
            </v-col>
            <!-- Viewer -->
            <v-col cols="10" v-if="tasksNotEmpty">
                <Header />
                <v-card
                    style="width: 100%; height: 84vh; overflow-y: scroll; background: black"
                    class="my-4"
                >
                    <v-list-item>
                        <v-list-item-content>
                            <v-row>
                                <transition name="fade" mode="out-in">
                                    <v-col cols="12" :key="$route.path">
                                        <!-- <DicomViewer :key="$route.path" /> -->
                                        <CustomDicomViewer :key="$route.path" />
                                    </v-col>
                                </transition>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
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
import DicomViewer from "../components/Shared/DicomViewer.vue";
import CustomDicomViewer from "../components/Shared/CustomDicomViewer.vue";
import Header from "../components/ClinicalReview/Header.vue";
import Tasks from "../components/ClinicalReview/Tasks.vue";
import ApprovalDialog from "../components/ClinicalReview/ApprovalDialog.vue";
import EmptyTaskList from "../views/EmptyTaskList.vue";
import { EventBus } from "@/event-bus";

@Component({
    components: {
        DicomViewer,
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
