# Table of Contents
- [Style guides](#style-guides)
    - [Colour palette](#colour-palette)
    - [Typography](#typography)
    - [Iconography](#iconography)
    - [Main components](#main-components)

# Style-guides
### Colour-palette
- Primary colour: `#61366E`
- Secondary colour: `#F7F3F9`

### Typography
- Headings use [Bai Jamjuree](https://fonts.google.com/specimen/Bai+Jamjuree) font style.
- Main font style is [Open Sans](https://fonts.google.com/specimen/Open+Sans).

### Iconography
The application uses [Material Design Icons](https://materialdesignicons.com/) library for iconography.

### Main-components

- Buttons - [Vuetify `v-btn` component](https://vuetifyjs.com/en/components/buttons/)
&nbsp;
    - **Primary button:** 
    Background colour: `#61366E`
    Text colour: `#FFFFFF`
    &nbsp;
    ![image](./static/primary-button.png)
    &nbsp;
    - **Secondary button:**
    Background colour: `#F7F3F9`
    Text colour: `#61366E`
    &nbsp;
    ![image](./static/secondary-button.png)
---
- Tables - [Vuetify `v-data-table` component](https://vuetifyjs.com/en/components/data-tables/). Tables use inbuilt pagination and searching/filtering/checkbox components (if applicable).
&nbsp;
    ![image](./static/table-issues.png)
---
- Modals - [Vuetify `v-dialog` component](https://vuetifyjs.com/en/components/dialogs/)
&nbsp;
    - **Confirmation modals**
    &nbsp;
    ![image](./static/confirmation-modal.png)  
    &nbsp;
    - **Form modals** - combines `v-dialog` and [Vuetify form `v-form`](https://vuetifyjs.com/en/components/forms/) UI components.
    &nbsp;
    ![image](./static/form-modal.png)  
---
- Toast notifications (used to inform the user if API requests are successful) implemented using `vue-toast-notification` package (https://www.npmjs.com/package/vue-toast-notification).
&nbsp;
    - **Successful toast notification:**
    &nbsp;
    ![image](./static/success-toast.png)  
    &nbsp;
    - **Error toast notification:**
    &nbsp;
    ![image](./static/error-toast.png)
