export default (_receivers) => {
    /* Initialize receiver. */
    let receiver

    /* Find the change receiver. */
    receiver = _receivers.find(_receiver => {
        return _receiver.address &&
            (
                typeof _receiver.satoshis === 'undefined' ||
                _receiver.satoshis === null ||
                _receiver.satoshis === ''
            ) &&
            (
                typeof _receiver.tokens === 'undefined' ||
                _receiver.tokens === null ||
                _receiver.tokens === ''
            )
    })

    return receiver
}
