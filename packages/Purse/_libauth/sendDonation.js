/* Import modules. */
import installBadger from '@/libs/installBadger'

/* Initialize donation address. */
// const donationAddress = 'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g' // EatBCH VE
// const donationAddress = 'bitcoincash:qrz4zlgjsqu0gu9xaayrrrlrttyv85xxzslp43veu6' // Causes Cash
const donationAddress = 'bitcoincash:qrlsrw8qyrce75pp654rx9s8hftgywkxwv89uwafs3' // APECS

/* Initialize donation amount. */
const donationAmount = 5000 // FIXME: Auto-calculate to $0.01

/**
 * Send Donation
 *
 * TODO: Will mitigate account spamming with a small donation
 *       to a charity of the user's choice.
 */
const sendDonation = () => {
    console.log('SEND DONATION')

    if (typeof window.web4bch !== 'undefined') {
        /* Initialize Web4BCH. */
        const web4bch = new window.Web4Bch(window.web4bch.currentProvider)
        console.log('web4bch', web4bch)

        /* Validate web4BCH. */
        if (!web4bch) {
            return installBadger()
        }

        console.log('DEFAULT ACCOUNT', web4bch.bch.defaultAccount)

        /* Validate account. */
        if (web4bch.bch && web4bch.bch.defaultAccount === undefined) {
            alert('please unlock your Badger wallet');
        }

        /* Set transaction parameters. */
        const txParams = {
            to: donationAddress,
            from: web4bch.bch.defaultAccount,
            value: donationAmount
        }

        /* Initialize transaction function. */
        const txFunc = (err, res) => {
            if (err) {
                console.error('ERROR: sendTransaction', err)

                console.log('ERROR MSG', err.message)

                /* Validate user approval. */
                if (err && err.message) {
                    if (err.message.indexOf('User denied transaction signature') !== -1) {
                        // FIXME: Add a modal message here.
                        alert('User rejected the signature transaction.')
                    }
                }

                return
            }

            console.log('TRANSACTION RESULT', res)
        }

        /* Send transaction. */
        web4bch.bch.sendTransaction(txParams, txFunc)
     } else {
         /* Install Badger. */
         installBadger()
     }

}

export default sendDonation
