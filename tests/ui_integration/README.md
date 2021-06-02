# Template Packages
- CodeceptJS
- Playwright
- Mochawesome
- ResembleJS

# Execution
- Tests can be executed by using the scripts in the package.json
- Html reports are generated in the output folder
- Any E2E tests must be tagged with 'E2E'
- Config files exist for Chromium, Firefox and Webkit. Chromium should be default

# ResembleJS (for more details please see https://github.com/codeceptjs/codeceptjs-resemblehelper)
- steps_file.js has a screenshot function which can invoked using I.TakePageScreenshotAndCompare(imageName)
- Screenshot comparison should only be used when creating ui_integration tests
- Screenshots will be created in the screenshots/base folder if one does not already exist 
- To update screenshots, delete from screenshots/base folder and re-run test
- Any match failures will create a screenshot with highlighted diffs in screenshots/diff

# Mocking
- helpers/Playwright_helper.js has mocking function which can be invoked using I.mockTheEndpoint(endpoint, content)
- This function will take a json file
- Json files will be saved in the mocks folder