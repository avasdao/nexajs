/* Import modules. */
import { Crypto } from '@nexajs/crypto'

/**
 * Get Avatar
 */
const getAvatar = (state, getter) => {
    /* Validate state. */
    if (!state || !getter.getEmail) {
        return null
    }

    /* Set email address. */
    const email = getter.getEmail
    // console.log('AVATAR (email):', email)

    /* Encode email address. */
    const encoded = Crypto.hash(email, 'md5', true)
    // console.log('AVATAR (encoded):', encoded)

    /* Set avatar (url). */
    const avatar = `http://www.gravatar.com/avatar/${encoded}.jpg?s=256`
    // console.log('AVATAR:', avatar)

    /* Return avatar. */
    return avatar
}

/* Export module. */
export default getAvatar
