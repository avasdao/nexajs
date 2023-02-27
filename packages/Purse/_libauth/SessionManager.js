/* Initialize Session Manager (Plugin). */
const SessionManager = {}

/**
 * Cleanup (Session)
 */
const cleanup = function (_this) {
    /* Delete session. */
    _this.$store.dispatch('profile/deleteSession')

    /* Navigate back to dashboard. */
    // TODO: Show modal OR alert notification.
    _this.$router.push('/')
}

/**
 * Session Manager Plugin Installation
 *
 * NOTE: Called from `main.js`, using `Vue.use()`.
 */
SessionManager.install = function (_Vue) {
    /* Initialize Vue mixin. */
    _Vue.mixin({
        methods: {
            /**
             * (User) Has (Active) Session?
             */
            hasSession() {
                /* Set api endpoint. */
                const apiUrl = this.$store.state.system.apiUrl
                // console.log('STORE API URL', apiUrl)

                /* Set session id. */
                const sessionId = this.$store.state.profile.sessionId
                // console.log('STORE SESSION ID', sessionId)

                return new Promise((resolve, reject) => {
                    fetch
                        .post(apiUrl + '/sessions')
                        .send({ sessionId })
                        .set('accept', 'json')
                        .end((err, res) => {
                            if (err) {
                                // console.error('SESSION MANAGER ERROR:', err)

                                /* Cleanup session. */
                                cleanup(this)

                                /* Return error. */
                                return reject(err)
                            }

                            // console.log('SESSION MANAGER RESULT', res)

                            /* Set session. */
                            const session = res.body
                            // console.log('SESSION MANAGER', session)

                            /* Validate session. */
                            if (!session) {
                                /* Cleanup session. */
                                cleanup(this)

                                return reject('Session Manager ERROR!')
                            }

                            /* Validate session (is Active). */
                            if (!session.isActive) {
                                /* Cleanup session. */
                                cleanup(this)

                                return reject('Session has EXPIRED!')
                            }

                            /* Resolve session. */
                            resolve(session)
                        })
                })
            }
        }
    })
}

/* Export plugin. */
export default SessionManager
