import { DestinationData } from "data/dicom-configuration/destinations";
import Destinations from "pages/adminDicomConfiguration";

const dicomConfigurationPage = new Destinations();
const destinationsData = DestinationData.DESTINATIONS_EXAMPLE;
const newDestinationData = DestinationData.DESTINATION_ADD;

describe.skip("Display list of destinations", () => {
    beforeEach(() => {
        dicomConfigurationPage.initPage();
    });

    describe("All expected elements on the page are visible", () => {
        it("Each row has an echo button visible", () => {
            dicomConfigurationPage.echoButtonVisibleDestinations();
        });

        it("Each row has an edit button visible", () => {
            dicomConfigurationPage.editButtonVisibleDestinations();
        });
        it("Each row has a delete button visible", () => {
            dicomConfigurationPage.deleteButtonVisibleDestinations();
        });
        it("Create new destination button is visible", () => {
            dicomConfigurationPage.createDestinationsButtonVisible();
        });
    });

    describe("GET destinations", () => {
        it(`The destinations table is populated with the data returned from the API`, () => {
            dicomConfigurationPage.assertTableDataCorrect(destinationsData);
        });
    });

    describe.skip("Add/Edit/Delete list of destinations", () => {
        describe("Add new destination", () => {
            it("Clicking on 'Add DICOM Configuration' opens up the modal", () => {
                dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
                dicomConfigurationPage.elementVisibleGet(".v-card__actions");
            });
            [
                "destination-name",
                "destination-ae-title",
                "destination-ip-address",
                "destination-port",
            ].forEach((field) => {
                it(`Validation should be displayed to the user to indicate that the '${field}' field is required`, () => {
                    dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
                    dicomConfigurationPage.requiredFieldsValidationDestinations(field);
                });
            });
            ["destination-name", "destination-ae-title"].forEach((field) => {
                it(`Validation should be displayed to the user to indicate the '${field}' doesn't allows spaces or special characters`, () => {
                    dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
                    dicomConfigurationPage.noSpacesOrSpecialCharactersValidation(field);
                });
            })
            it("'Save' button is inactive until all fields are populated", () => {
                dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
                dicomConfigurationPage.saveDisabledUnlessAllFIeldsEntered(newDestinationData);
            });
            it("Discarding a destination on the Modal does not save it", () => {
                dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
                dicomConfigurationPage.enterAddDestinationDetails(newDestinationData);
                dicomConfigurationPage.clickDataCy("destination-create-cancel");
                dicomConfigurationPage.assertDestinationNotSaved(destinationsData);
            });
        });
    });

    describe("Edit destination", () => {
        it("Clicking on edit button opens up the edit modal", () => {
            dicomConfigurationPage.clickDataCy("destination-action-edit-0");
            dicomConfigurationPage.elementVisibleGet(".v-card__actions");
        });
        ["destination-ae-title", "destination-ip-address", "destination-port"].forEach((field) => {
            it(`Validation should be displayed to the user to indicate that the '${field}' field is required`, () => {
                dicomConfigurationPage.clickDataCy("destination-action-edit-0");
                dicomConfigurationPage.requiredFieldsValidationDestinations(field);
            });
        });
        it(`Destination name field should be disabled when editing`, () => {
            dicomConfigurationPage.clickDataCy("destination-action-edit-0");
            dicomConfigurationPage.elementDisabled("destination-name");
        });
        it("Clicking on 'Save' button opens up the edit destination confirmation modal", () => {
            dicomConfigurationPage.clickDataCy("destination-action-edit-0");
            dicomConfigurationPage.enterEditDestinationDetails(newDestinationData);
            dicomConfigurationPage.clickDataCy("destination-create-save");
            dicomConfigurationPage.elementVisibleGet(".v-card__text");
            dicomConfigurationPage.containsText(".v-card__text", destinationsData.name);
        });
        it("Clicking on 'Cancel' button closes the Edit modal without saving the changes", () => {
            dicomConfigurationPage.clickDataCy("destination-action-edit-0");
            dicomConfigurationPage.enterEditDestinationDetails(newDestinationData);
            dicomConfigurationPage.clickDataCy("destination-create-cancel");
            dicomConfigurationPage.assertTableDataCorrect(destinationsData);
        });
    });

    describe("Delete destination", () => {
        it("Clicking on delete button opens up the delete modal", () => {
            dicomConfigurationPage.clickDataCy("destination-action-delete-0");
            dicomConfigurationPage.elementVisibleGet(".v-card__actions");
        });
        it("Clicking on 'Yes, delete' button sends the correct API request", () => {
            dicomConfigurationPage.clickDataCy("destination-action-delete-0");
            dicomConfigurationPage.deleteDestinationAPIRequest(destinationsData, 200);
        });
        it("Clicking on 'Cancel' button closes the modal", () => {
            dicomConfigurationPage.clickDataCy("destination-action-delete-0");
            dicomConfigurationPage.elementNotVisibleGet(".v-card__actions");
        });
    });

    describe("Echo destination", () => {
        it("Clicking on echo button displays echo status", () => {
            dicomConfigurationPage.echoStatusDisplayedWithValue(
                "destination-echo-status-0",
                200,
                "succeeded",
            );
            dicomConfigurationPage.elementVisibleDataCy("destination-echo-status-0");
        });
        it("Successful echo displays 'Succeeded' as echo status", () => {
            dicomConfigurationPage.echoStatusDisplayedWithValue(
                "destination-echo-status-0",
                200,
                "succeeded",
            );
        });
        [400, 404, 408, 500, 502, 503, 504].forEach((statusCode) => {
            it("Unsuccessful echo displays 'Failed' as echo status", () => {
                dicomConfigurationPage.echoStatusDisplayedWithValue(
                    "destination-echo-status-0",
                    statusCode,
                    "failed",
                );
            });
        });
    });
});
describe.skip(" API errors", () => {
    const initError = "Something unexpected went wrong retrieving DICOM configurations";
    const deleteError = "Something unexpected went wrong deleting the DICOM configuration";
    const editError = "Something unexpected went wrong updating the DICOM configuration";
    const addError = "Something unexpected went wrong creating DICOM configuration";

    [400, 404, 500, 501].forEach((statusCode) => {
        it(`Toast displayed if a ${statusCode} error is returned on getting Dicom configerations`, () => {
            dicomConfigurationPage.initPageError(statusCode);
            dicomConfigurationPage.assertToast(initError);
        });
        it(`Toast displayed if a ${statusCode} error is returned on deleting existing Dicom configuration`, () => {
            dicomConfigurationPage.initPage();
            dicomConfigurationPage.clickDataCy("destination-action-delete-0");
            dicomConfigurationPage.deleteDestinationAPIRequest(destinationsData, statusCode);
            dicomConfigurationPage.assertToast(deleteError);
        });
        it(`Toast displayed if a ${statusCode} error is returned on editing a workflow`, () => {
            dicomConfigurationPage.initPage();
            dicomConfigurationPage.clickDataCy("destination-action-edit-0");
            dicomConfigurationPage.enterEditDestinationDetails(newDestinationData);
            dicomConfigurationPage.clickDataCy("destination-create-save");
            dicomConfigurationPage.editDestinationAPIRequest(destinationsData, statusCode);
            dicomConfigurationPage.assertToast(editError);
        });
        it(`UI message displayed if a ${statusCode} error is returned on adding a workflow`, () => {
            dicomConfigurationPage.initPage();
            dicomConfigurationPage.clickDataCy("add-dicom-configuration-button");
            dicomConfigurationPage.enterAddDestinationDetails(newDestinationData);
            dicomConfigurationPage.addDestinationAPIRequest(statusCode);
            dicomConfigurationPage.assertToast(addError);
        });
    });
});
