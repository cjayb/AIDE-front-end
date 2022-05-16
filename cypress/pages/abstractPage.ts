import ApiMocks from "../fixtures/mockIndex";
import { Version } from "../../src/models/Application";
export interface IPage {

    /**
     * To be called at the start of a test on a given page.
     * Can be used to wait for loading, or seed data for example.
     */
   initPage(): void;
}

export class AbstractPage implements IPage {
    assertLatestErrorContainsMessage(text: string): void {
        cy.get("[class=v-toast__text]").should("have.text", text);
    }

// waiting on dan to reply about ordering
    public VersionDropdown(dropdownId: string, versions: Array<Version>): void {
        if (versions != null) {
            versions.forEach((version) => {
                cy.dataCy(dropdownId).click();
                cy.get(".v-menu__content").contains(version.version_string).click({ force: true });
                cy.get(".v-select__selections").should("have.text", version.version_string);

            });
        } else {
            cy.log("No versions were provided");
        }
    }

    // VersionDropdown(dropdownId: string, selection: string): void {
    //     cy.dataCy(dropdownId).click();
    //     cy.get(".v-menu__content").contains(selection).click({ force: true});
    // }

    alphabeticalOrderDropDown(dropdownId: string, selection: string): void {
        cy.dataCy(dropdownId).click();
        cy.get(".v-menu__content").contains(selection).click({ force: true});
    }

    dateTimeConvertor(dateTimeObject: string) {
        const dateStr = dateTimeObject;
        const dateObject = new Date(dateStr);
        const day = dateObject.getDate();
        const month = (dateObject.getMonth() + 1).toString().padStart(2,'0');
        const year = dateObject.getFullYear();
        const OutputStr = `${day}/${month}/${year}`;
        return OutputStr
    }

    initPage(){
        // To be overridden by each page
    }
}
