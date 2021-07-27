<template>
    <v-container style="max-width: 100%">
        <!-- Statistics -->
        <v-row class="text-right">
            <v-container>
                <v-col class="text-right">
                    <v-btn text disabled> Show </v-btn>
                    <v-btn
                        elevation="2"
                        rounded
                        :color="day.color"
                        :dark="day.active"
                        @click="setDays(day)"
                        >24 Hours</v-btn
                    >
                    <v-btn
                        elevation="2"
                        rounded
                        :color="week.color"
                        :dark="week.active"
                        @click="setDays(week)"
                        >Weekly</v-btn
                    >
                    <v-btn
                        elevation="2"
                        rounded
                        :color="month.color"
                        :dark="month.active"
                        @click="setDays(month)"
                        >Monthly</v-btn
                    >
                </v-col>
            </v-container>
        </v-row>
        <!-- Statistics -->
        <v-row>
            <Statistics :key="this.$store.state.days" />
        </v-row>
        <v-row class="text-right">
            <v-container>
                <v-col class="text-right">
                    <v-btn text disabled> View </v-btn>
                    <v-btn
                        elevation="2"
                        rounded
                        :color="execution.color"
                        :dark="execution.active"
                        @click="setStats(execution)"
                        >Execution Run Stats</v-btn
                    >
                    <v-btn
                        elevation="2"
                        rounded
                        :color="performance.color"
                        :dark="performance.active"
                        @click="setStats(performance)"
                        >Performance</v-btn
                    >
                </v-col>
            </v-container>
        </v-row>
        <!-- Models -->
        <v-row>
            <ModelTable
                :key="this.$store.state.days"
                v-if="this.$store.state.stats == 'execution'"
            />

            <PerformanceTable
                :key="this.$store.state.days"
                v-if="this.$store.state.stats == 'performance'"
            />
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Statistics from "../components/AdminDashboard/Statistics.vue";
import ModelTable from "../components/AdminDashboard/ModelTable.vue";
import PerformanceTable from "../components/AdminDashboard/PerformanceTable.vue";

@Component({
    components: {
        Statistics,
        ModelTable,
        PerformanceTable,
    },
})
export default class AdminDashboard extends Vue {
    day = { value: "1", color: "#61366e", active: true };
    week = { value: "7", color: "", active: false };
    month = { value: "30", color: "", active: false };

    execution = { value: "execution", color: "#61366e", active: true };
    performance = { value: "performance", color: "", active: false };

    setDays(selection: any): void {
        if (selection.value == "1") {
            this.day.active = true;
            this.day.color = "#61366e";
            this.week.active = false;
            this.week.color = "";
            this.month.active = false;
            this.month.color = "";
        }

        if (selection.value == "7") {
            this.day.active = false;
            this.day.color = "";
            this.week.active = true;
            this.week.color = "#61366e";
            this.month.active = false;
            this.month.color = "";
        }

        if (selection.value == "30") {
            this.day.active = false;
            this.day.color = "";
            this.week.active = false;
            this.week.color = "";
            this.month.active = true;
            this.month.color = "#61366e";
        }
        this.$store.commit("setDays", selection.value);
    }

    setStats(selection: any): void {
        if (selection.value == "execution") {
            this.execution.active = true;
            this.execution.color = "#61366e";
            this.performance.active = false;
            this.performance.color = "";
        }

        if (selection.value == "performance") {
            this.execution.active = false;
            this.execution.color = "";
            this.performance.active = true;
            this.performance.color = "#61366e";
        }
        this.$store.commit("setStats", selection.value);
    }
}
</script>
