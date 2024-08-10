


/**
 * Covert Server
 *
 * Server for covert submissions. How it works:
 *   - Launch the server at any time. By default, will bind to an ephemeral port.
 *   - Before start of covert components phase, call start_components.
 *   - To signal the end of covert components phase, owner calls end_components, which returns a dict of {component: contrib}, where contrib is (+- amount - fee).
 *   - Before start of covert signatures phase, owner calls start_signatures.
 *   - To signal the end of covert signatures phase, owner calls end_signatures, which returns a list of signatures (which will have None at positions of missing signatures).
 *   - To reset the server for a new round, call .reset(); to kill all connections, call .stop().
 */
export default class CovertServer() {
    constructor() {
        super()

        this.roundPubkey = null
    }

    start_components() {

    }

    end_components() {

    }

    start_signatures() {

    }

    end_signatures() {

    }

    reset() {

    }

    new_client_job() {
        
    }
}
