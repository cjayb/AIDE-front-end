const fs = require('fs');
const conf = require('./codecept.conf')

module.exports = function() {
  return actor({
    TakePageScreenshotAndCompare: async function(imageName) {
      let baselineNotExists = !fs.existsSync(conf.config.helpers.ResembleHelper.baseFolder + imageName + ".png")

      this.saveScreenshot(imageName + ".png", true);
      await this.seeVisualDiff(imageName + ".png", {
          prepareBaseImage: baselineNotExists,
          tolerance: 5,
          scaleToSameSize: true
      });
    }
  });
}
