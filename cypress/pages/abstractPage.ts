export interface IPage {
    
    /**
     * To be called at the start of a test on a given page.
     * Can be used to wait for loading, or seed data for example.
     */
    initPage(): void;
}

export class AbstractPage implements IPage {
    assertLatestErrorContainsMessage(text: string): void {
        cy.get('[class=v-toast__text]').should("have.text", text);
    }

    initPage(){
        // To be overridden by each page
    }
}