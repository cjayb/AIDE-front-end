<template>
    <v-container fluid class="clinical-review-container">
        <v-row class="patient-header"></v-row>
        <v-row class="clinical-review">
            <v-col class="task-list"></v-col>
            <v-col class="dicom-view">
                <dicom-view :task-execution-id="currentTask" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DicomView from "@/components/clinical-review/dicom-view.vue";

export default defineComponent({
    metaInfo: {
        title: "Clinical Review",
    },
    components: {
        DicomView,
    },
    data() {
        return {
            currentTask: "0d956b22-37dc-4491-9750-ff4dbe96b39a",
        };
    },
});
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
    background-color: #e4e4e4;
    height: 80px;
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
        background-color: rgb(243, 255, 209);
    }
}
</style>
