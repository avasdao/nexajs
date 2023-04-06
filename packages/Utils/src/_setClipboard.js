/**
 * Set Clipboard
 */
const setClipboard = ({}, _params) => { // eslint-disable-line no-empty-pattern
    try {
        const textArea = document.createElement('textarea')
        textArea.value = _params
        document.body.appendChild(textArea)

        if (navigator.userAgent.match(/ipad|iphone/i)) {
            const range = document.createRange()
            range.selectNodeContents(textArea)

            const selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)

            textArea.setSelectionRange(0, 999999)
        } else {
            textArea.select()
        }

        document.execCommand('copy')
        document.body.removeChild(textArea)
    } catch (err) {
        console.error(err) // eslint-disable-line no-console

        /* Report error. */
        Bugsnag.notify(err)
    }
}

/* Export module. */
export default setClipboard
