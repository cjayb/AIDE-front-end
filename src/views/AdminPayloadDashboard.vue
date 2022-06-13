<template>
    <PayloadsTable />
</template>

<script lang="ts">
import PayloadsTable from "@/components/AdminPayloadDashboard/PayloadsTable.vue";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
    components: {
        PayloadsTable,
    },
})
export default class AdminPayloadDashboard extends Vue {
    // Declared as component data
}
</script>
