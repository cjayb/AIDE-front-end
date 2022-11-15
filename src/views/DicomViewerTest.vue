<template>
    <v-container fluid class="clinical-review-container">
        <dicom-view />
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DicomView from "@/components/clinical-review/dicom-view.vue";

export default defineComponent({
    components: {
        DicomView,
    },
});
</script>

<style lang="scss" scoped>
.clinical-review-container {
    height: 100%;
    padding: 0;
}

.clinical-review {
    margin: 0;
    height: 100%;

    > .col {
        padding: 0;
    }
}

.task-panel {
    overflow: hidden;
    display: flex;
    flex-direction: column;

    > .row {
        margin: 0;
    }

    .patient-header {
        flex: initial;
    }

    .task-panel-dicom {
        flex: 1 !important;

        .dicom-canvas-wrapper {
            width: 100%;
        }
    }
}
</style>
