const { I, mocks , screenshotter} = inject();

export = {
    // Default Screen
    weeklyView: locate(".v-btn").withChild(".v-btn__content").withText("Weekly"),
    monthlyView: locate(".v-btn").withChild(".v-btn__content").withText("Monthly"),
    dayView: locate(".v-btn").withChild(".v-btn__content").withText("24 Hours"),
    expandModelRow: ".mdi-chevron-down",
    freeTextSearch: locate("input").inside(".v-text-field__slot"),
    modelsTitle: locate(".v-toolbar__title").withText("Models"),

    // Execution Results
    viewLogsModel1: locate(".v-btn").withChild(".v-btn__content").withText("View Logs").at(1),
    endOfLogs: locate(".vjs-key").withText("message"),
    viewOutputModel1: locate(".v-btn").withChild(".v-btn__content").withText("View Output").at(1),
    viewPipelineModel1: locate(".v-btn").withChild(".v-btn__content").withText("View Pipeline").at(1),
    closeModal: locate(".v-btn").withChild(".v-btn__content").withText("Close"),

    // Execution Results Pagination
    previousPage: ".mdi-chevron-left",
    rowsPerPageSelector: ".mdi-menu-down",
    nextPage: ".mdi-chevron-right",

    // Model Data
    model1Name: mocks.adminDashboardModels[0]["model_name"],
    model2Name: mocks.adminDashboardModels[1]["model_name"],

    IToggleModelRowDetail(modelIndex: number){ 
        I.click(locate(this.expandModelRow).at(modelIndex + 1));
    },

    async ITestSort(text: string, screenshotRef = ""){
        const locator = locate("th").withChild("span").withText(text);
        I.doubleClick(locator);
        await screenshotter.TakePageScreenshotAndCompare(`adminDashboardSort${text}${screenshotRef}Desc`);
        I.click(locator);
        await screenshotter.TakePageScreenshotAndCompare(`adminDashboardSort${text}${screenshotRef}Asc`);
        I.click(locator);
    },

    async ITestPagination(){
        this.IToggleModelRowDetail(1);
        I.click(this.nextPage);
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardPaginationPage2")
        I.click(this.previousPage);
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardPaginationPage1")
    },

    async ITestViewingModels(){
        this.IToggleModelRowDetail(0);
        I.moveCursorTo(this.modelsTitle);
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardModel1Stats");
        this.IToggleModelRowDetail(0);
        I.moveCursorTo(this.modelsTitle);
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardDefault");
    },

    async ITestWeeklyAndMonthlyView(){
        I.click(this.weeklyView);
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardWeeklyView");
        I.click(this.monthlyView);
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardMonthlyView");
        I.click(this.dayView);
    },

    async ITestFreetextSearch(){
        I.fillField(this.freeTextSearch, "ch")
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardFreetextSearchModelName");
        I.fillField(this.freeTextSearch, "3000")
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardFreetextSearchFailures");
        I.fillField(this.freeTextSearch, "xyz")
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardFreetextSearchEmpty");
        I.clearField(this.freeTextSearch);
        I.fillField(this.freeTextSearch, " ");
    },

    async ITestSorts(){
        await this.ITestSort("Failures");
        I.fillField(this.freeTextSearch, "3");
        await this.ITestSort("Executions");
        I.clearField(this.freeTextSearch);
        I.fillField(this.freeTextSearch, " ");
        this.IToggleModelRowDetail(0);
        await this.ITestSort("Failures", "Toggled");
        this.IToggleModelRowDetail(0);
    },

    async ITestViewExecutionLog(){
        this.IToggleModelRowDetail(0);
        I.click(this.viewLogsModel1);
        I.scrollTo(this.endOfLogs);
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardViewLogs");
        I.click(this.closeModal);
        I.moveCursorTo(this.modelsTitle);
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardModel1Stats");
    },

    async ITestViewModelOutput(){
        this.IToggleModelRowDetail(0);
        I.click(this.viewOutputModel1);
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardViewOutput");
        I.click(this.closeModal);
        I.moveCursorTo(this.modelsTitle);
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardModel1Stats");
    },

    async ITestViewExecutionPipeline(){
        this.IToggleModelRowDetail(0);
        I.click(this.viewPipelineModel1);
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardViewPipeline");
        I.click(this.closeModal);
        I.moveCursorTo(this.modelsTitle);
        await screenshotter.TakePageScreenshotAndCompare("adminDashboardModel1Stats");
    },

}