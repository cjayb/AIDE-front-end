const { I } = inject();
const fs = require("fs");
const conf = require("../codecept.conf");

export = {
    TakePageScreenshotAndCompare: async function (imageName: string) {
        let baselineNotExists = !fs.existsSync(
            conf.config.helpers.ResembleHelper.baseFolder + imageName + ".png"
        );

        I.saveScreenshot(imageName + ".png", true);
        await (I as any).seeVisualDiff(imageName + ".png", {
            prepareBaseImage: baselineNotExists,
            tolerance: 5,
            scaleToSameSize: true,
        });
    },
};
