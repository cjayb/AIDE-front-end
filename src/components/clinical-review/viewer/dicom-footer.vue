<template>
    <v-row class="footer">
        <v-col cols="2"></v-col>
        <v-col>
            <v-layout justify-center>
                <v-btn-toggle dark dense data-cy="dicom-footer">
                    <v-btn disabled data-cy="dicom-footer-slice">
                        <span>Slice {{ currentSlice + 1 }}/{{ totalSlices }}</span>
                    </v-btn>
                    <v-btn disabled data-cy="dicom-footer-windowing">
                        <span>WW/WC {{ windowing.windowWidth }}/{{ windowing.windowCenter }}</span>
                    </v-btn>
                </v-btn-toggle>
            </v-layout>
        </v-col>
        <v-col cols="2"></v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { utilities } from "@cornerstonejs/core";
import { VOIRange } from "@cornerstonejs/core/dist/esm/types";

type Windowing = {
    windowWidth: number;
    windowCenter: number;
};

export default defineComponent({
    props: {
        currentSlice: { default: 0, type: Number },
        totalSlices: { default: 0, type: Number },
        voiRange: { default: undefined, type: Object as PropType<VOIRange> },
    },
    computed: {
        windowing(): Windowing {
            if (!this.voiRange) {
                return { windowWidth: 0, windowCenter: 0 };
            }

            const { lower, upper } = this.voiRange;

            return utilities.windowLevel.toWindowLevel(lower, upper);
        },
    },
});
</script>

<style lang="scss" scoped>
.footer {
    position: absolute;
    bottom: 0;
    width: 100%;

    &.row {
        margin: 0;
    }
}
</style>
