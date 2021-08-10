const { I, mocks , screenshotter} = inject();

export = {

    //Aggregated stats
    aggregatedModelStats: "$model-stats",
    aggregatedmodelExecutions: "$model-executions",
    aggregatedExecutionFailures: "$execution-failures",
    aggregatedSuccessRate: "$success-rate",
    freetextSearch: '$search-tasks-input',
    clearFreetextSearch: locate(".v-input__icon--clear").withChild("button"),
    workListItemTitle: "$work-list-item",

    async IViewAndFilterWorkList(){
        I.fillField(this.freetextSearch, "de");
        I.click(locate(this.workListItemTitle).withText("Minerva Dennis"));
        this.IWaitForDicomViewerToLoad();
        await screenshotter.TakePageScreenshotAndCompare("clinicalReviewFreetextSearchModelName");
        I.click(this.clearFreetextSearch);
        I.fillField(this.freetextSearch, "3000");
        await screenshotter.TakePageScreenshotAndCompare("clinicalReviewFreetextSearchEmpty");
        I.click(this.clearFreetextSearch);        
    },

    IWaitForDicomViewerToLoad(){
        I.waitForVisible(".loading-indicator", 10)
        I.waitForVisible(".top-left.overlay-element", 10);
    },
}
