// IMPORTANT NOTE:
// IN ORDER TO ENABLE MIDDLEWARE COMPONENTS,
// YOU MUST UNCOMMENT ALL OF THE LINES BELOW, ONLY ONCE.
// (SOME LINES *SHOULD* REMAIN COMMENTED AFTEWARDS)

export default defineEventHandler((event) => {
//     /* Set response headers. */
//     setResponseHeaders(event, {
//         /* Set allowed methods. */
//         'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
//
//         /* Set allowed origins. */
//         'Access-Control-Allow-Origin': '*',
//
//         /* Set allowed credentials. */
//         'Access-Control-Allow-Credentials': 'true',
//
//         /* Set allowed headers. */
//         'Access-Control-Allow-Headers': '*',
//
//         /* Set exposed headers. */
//         'Access-Control-Expose-Headers': '*',
//     })
//
//     /* Handle `OPTIONS` event. */
//     if (getMethod(event) === 'OPTIONS') {
//         /* Set status code. */
//         event.node.res.statusCode = 204
//
//         /* Set status message. */
//         event.node.res.statusMessage = 'No Content.'
//
//         /* Return OK. */
//         return 'OK'
//     }
})
