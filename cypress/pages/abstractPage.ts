import { Version } from "../../src/models/AppRepo/Application";
export interface IPage {
    /**
     * To be called at the start of a test on a given page.
     * Can be used to wait for loading, or seed data for example.
     */
    initPage(): void;
}

export class AbstractPage implements IPage {
    public clickGet(selector: string, force?: boolean) {
        cy.get(selector).click({ force });
    }

    public clickDataCy(selector: string) {
        cy.dataCy(selector).click({ force: true });
    }
    public assertDropdownContents(dropdownId: string, selection: string): void {
        cy.dataCy(dropdownId).click({ force: true });
        cy.get(".v-menu__content").should("contain", selection);
    }

    public assertLatestErrorContainsMessage(text: string): void {
        cy.get("[class=v-toast__text]").should("have.text", text);
    }

    public assertToast(text: string): void {
        cy.get("[class=v-toast__text]").should("have.text", text);
    }

    public assertNoToast(): void {
        cy.get("[class=v-toast__text]").should("not.exist");
    }

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

    public alphabeticalOrderDropDown(dropdownId: string, selection: string): void {
        cy.dataCy(dropdownId).click();
        cy.get(".v-menu__content").contains(selection).click({ force: true });
    }

    public dateTimeConvertor(dateTimeObject: string) {
        const dateStr = dateTimeObject;
        const dateObject = new Date(dateStr);
        const day = dateObject.getDate();
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObject.getFullYear();
        const OutputStr = `${day}/${month}/${year}`;
        return OutputStr;
    }

    public initPage() {
        // To be overridden by each page
    }
}
