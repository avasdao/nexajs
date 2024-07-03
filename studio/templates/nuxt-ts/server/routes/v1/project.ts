export default defineEventHandler((event) => {
    /* Initialize locals. */
    let project
    let projectid
    let projectName

    projectid = process?.env?.PROJECT_ID
    projectName = process?.env?.PROJECT_NAME

    /* Build project. */
    project = {
        projectid,
        projectName,
    }

    /* Return project details. */
    return project
})
