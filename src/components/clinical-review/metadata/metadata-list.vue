<template>
    <v-navigation-drawer
        absolute
        temporary
        right
        hide-overlay
        dark
        floating
        :value="displayMetadata"
        :stateless="true"
    >
        <v-list>
            <v-list-item-group style="margin-bottom: 12px">
                <v-subheader>PINNED</v-subheader>
                <metadata-item
                    name="SpecificCharacterSet"
                    value="ISO_IR 100"
                    @pin-item="pinItem"
                    :pinned="true"
                />
            </v-list-item-group>
            <v-list-item-group>
                <v-subheader>METADATA</v-subheader>
                <metadata-item name="SpecificCharacterSet" value="ISO_IR 100" @pin-item="pinItem" />
                <metadata-item name="ImageType" value="ORIGINAL\PRIMARY\AXIAL" />
                <metadata-item name="SOPClassUID" value="1.2.840.10008.5.1.4.1.1.2" />
                <metadata-item
                    name="SOPInstanceUID"
                    value="1.2.276.0.7230010.3.1.4.296485376.1.1521713546.1839361"
                />
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MetadataItem from "./metadata-item.vue";

export default defineComponent({
    components: {
        MetadataItem,
    },
    computed: {
        displayMetadata(): boolean {
            return this.showMetadata;
        },
    },
    props: {
        showMetadata: { default: false, type: Boolean },
    },
    methods: {
        pinItem(name: string) {
            console.log(name);
        },
    },
});
</script>

<style lang="scss" scoped>
.theme--dark.v-navigation-drawer {
    background: none;
}

.v-navigation-drawer--is-mobile,
.v-navigation-drawer--temporary {
    box-shadow: none;
    top: 60px !important;
}

.v-list {
    padding-right: 12px;

    .v-list-item,
    .v-list-item::before,
    .v-list-item > .v-ripple__container {
        border-radius: 12px !important;
    }
}
</style>
