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

    clickDropdown(dropdownId: string, selection: string): void {
        cy.dataCy(dropdownId).click();
        cy.get(".v-menu__content").contains(selection).click();
    }
    dateTimeConvertor(givenDateTime: string) {
        const dateTime = new Date(givenDateTime);
        const convertedDateTime =
            dateTime.getDate() +
            "/" +
            (dateTime.getMonth() + "1") +
            "/" +
            dateTime.getFullYear() +
            " " +
            dateTime.getHours() +
            ":" +
            dateTime.getMinutes();
        return convertedDateTime;
    }

    initPage(){
        // To be overridden by each page
    }
}
