import EmptyTaskList from './EmptyTaskList.vue'

describe('<EmptyTaskList />', () => {
  it('renders', () => {
    // see: https://test-utils.vuejs.org/guide/
    cy.mount(EmptyTaskList)
  })
})