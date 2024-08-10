

/**
 * Results Collector (Class)
 *
 * TBD...
 */
export default class ResultsCollector() {
    constructor() {
        this.num_results = int(num_results)

        this.done_on_fail = bool(done_on_fail)

        this.done_ev = threading.Event()

        this.lock = threading.Lock()

        this.results = []

        this.fails = []

    }
}
