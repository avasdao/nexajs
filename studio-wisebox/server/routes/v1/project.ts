export default defineEventHandler((event) => {
    const projectid = process.env.PROJECT_ID
    const projectName = process.env.PROJECT_NAME

    /* Build project. */
    const project = {
        projectid,
        projectName,
    }

    /* Return project details. */
    return project
})
