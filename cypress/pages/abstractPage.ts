export default interface IPage {
    
    /**
     * To be called at the start of a test on a given page.
     * Can be used to wait for loading, or seed data for example.
     */
    initPage(): void;
}