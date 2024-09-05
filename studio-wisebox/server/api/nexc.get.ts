/* Import modules. */
import * as nexc from '@nexscript/nexc'
import { binToHex } from '@nexajs/utils'

// import moment from 'moment'
// import { sha256 } from '@nexajs/crypto'
// import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(event => {
    /* Initialize locals. */
    let body
    let response
    let session
    let sessionid
    let success

    /* Set (request) body. */
    // body = await readBody(event)
    // console.log('DEBUG (nexc):', nexc)

const sourceCode = `
pragma nexscript >= 1.0.0;

contract TransferWithTimeout(pubkey sender, pubkey recipient, int timeout) {
    // Require recipient's signature to match
    function transfer(sig recipientSig) {
        require(checkSig(recipientSig, recipient));
    }

    // Require timeout time to be reached and sender's signature to match
    function timeout(sig senderSig) {
        require(checkSig(senderSig, sender));
        require(tx.time >= timeout);
    }
}
`

    const compiled = nexc.compileString(sourceCode)
    // console.log('\nCOMPILED', compiled)

    const asm = compiled.contracts[0].bytecode
    console.log('\nASM', asm)
    // console.log('\nBYTECODE', bytecode)

    // const other = nexc.utils.countOpcodes(compiled.contracts[0].bytecode)
    // console.log('\nother', other)

    let output

    output = nexc.utils.asmToBytecode(asm)
    console.log('\nOUTPUT-1', binToHex(output))
    // console.log('\noutput', output)

    output = nexc.utils.bytecodeToScript(binToHex(output))
    console.log('\nOUTPUT-2', (output))
    // console.log('\noutput', output)

    // countOpcodes
    // decodeString
    // encodeInt
    // encodeString

    // asmToBytecode
    // asmToScript
    // bytecodeToAsm
    // bytecodeToScript
    // calculateBytesize
    // countOpcodes
    // generateRedeemScript
    // scriptToAsm
    // scriptToBytecode


    /* Return session. */
    return true
})
