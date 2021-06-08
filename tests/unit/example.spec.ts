import { Dashboard } from "@/components/Dashboard.vue";
import { shallowMount } from "@vue/test-utils";

describe("Dashboard.vue", () => {
    it("renders props.msg when passed", () => {
        const msg = "new message";
        const wrapper = shallowMount(Dashboard, {
            propsData: { msg },
        });
        expect(wrapper.text()).toMatch(msg);
    });
});
