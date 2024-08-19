/**
 * Copy To Clipboard
 *
 * Will save the text to the user's clipboard.
 */
export default (_text) => {
    /* Validate client. */
    // NOTE: We ONLY run this on the (web) client.
    if (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined' &&
        typeof navigator !== 'undefined'
    ) {
        /* Initialize clipboard handler. */
        const clipboardHandler = (function (window, document, navigator) {
            /* Initialize locals. */
            let copy
            let textArea

            function isOS() {
                return navigator.userAgent.match(/ipad|iphone/i)
            }

            function createTextArea(text) {
                textArea = document.createElement('textArea')
                textArea.value = text
                document.body.appendChild(textArea)
            }

            function selectText() {
                let range,
                    selection

                if (isOS()) {
                    range = document.createRange()
                    range.selectNodeContents(textArea)
                    selection = window.getSelection()
                    selection.removeAllRanges()
                    selection.addRange(range)
                    textArea.setSelectionRange(0, 999999)
                } else {
                    textArea.select()
                }
            }

            function _copyToClipboard() {
                document.execCommand('copy')
                document.body.removeChild(textArea)
            }

            copy = function (text) {
                createTextArea(text)
                selectText()
                _copyToClipboard()
            }

            return { copy }
        })(window, document, navigator)

        /* Execute clipboard handler. */
        clipboardHandler.copy(_text)

        // Success!
        return true
    }

    // Failed!
    return false
}
