<template>
    <v-container fluid class="clinical-review-container">
        <v-row class="patient-header">
            <Header />
        </v-row>
        <v-row class="clinical-review">
            <!-- Task List -->
            <v-col class="task-list">
                <v-divider class="mt-4" />
                <Tasks />
            </v-col>
            <!-- Viewer -->
            <v-col class="dicom-view" v-if="tasksNotEmpty">
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
    metaInfo: {
        title: "Clinical Review",
    },
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

<style lang="scss" scoped>
.clinical-review-container {
    height: 100%;
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    > .row {
        margin: 0;
    }
}

.patient-header {
    height: 70px;
    align-content: center;
}
.clinical-review {
    margin: 0;
    height: 100%;
    > .col {
        padding: 0;
    }
    .task-list {
        width: 350px;
        flex: initial;
    }
}
</style>
