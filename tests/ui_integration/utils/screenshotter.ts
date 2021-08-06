const { I } = inject();
const fs = require("fs");
const conf = require("../codecept.conf");

export = {
    TakePageScreenshotAndCompare: async function (imageName: string) {
        const baselineNotExists = !fs.existsSync(
            conf.config.helpers.ResembleHelper.baseFolder + imageName + ".png",
        );

        /**
         * Wait before taking screenshot to allow for any animations to complete
         */
        I.wait(0.5);
        I.saveScreenshot(imageName + ".png", true);
        await (I as any).seeVisualDiff(imageName + ".png", {
            prepareBaseImage: baselineNotExists,
            tolerance: 2,
            scaleToSameSize: true,
        });
    },
};
