<template>
    <v-container>
        <PayloadsTable />
    </v-container>
</template>

<script lang="ts">
import PayloadsTable from "@/components/AdminPayloadDashboard/PayloadsTable.vue";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
    metaInfo: {
        title: "Payloads",
    },
    components: {
        PayloadsTable,
    },
})
export default class AdminPayloadDashboard extends Vue {}
</script>
