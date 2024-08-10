

/**
 * Fusion Controller (Class)
 *
 * This controls the Fusion rounds running from server side.
 */
export default class FusionController() {
    constructor(network, tier, clients, bindhost, upnp = None, announcehost = None) {
        this.network = network
        this.tier = tier
        this.clients = list(clients)
        this.bindhost = bindhost
        this.upnp = upnp
        this.announceHost = announcehost
        this.daemon = True
    }
}
