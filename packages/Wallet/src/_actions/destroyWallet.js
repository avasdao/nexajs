/**
 * Destroy Wallet
 */
const destroyWallet = ({ commit }) => {
    console.info('Destroying wallet...') // eslint-disable-line no-console

    /* Commit empty wallet. */
    commit('setEmptyWallet')
}

/* Export module. */
export default destroyWallet
