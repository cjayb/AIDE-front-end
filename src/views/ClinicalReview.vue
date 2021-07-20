<template>
    <DicomViewer />
</template>

<script lang="ts">
import Vue from "vue";
import DicomViewer from "../components/AdminDashboard/DicomViewer.vue";

export default Vue.extend({
    name: "ClinicalReview",

    components: {
        DicomViewer,
    },
});
</script>
