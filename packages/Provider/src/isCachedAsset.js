/* Import TDDs. */
import _5f2456fa44a88c4a831a4b7d1b1f34176a29a3f28845af639eb9b1c88dd40000 from '../tdd/5f2456fa44a88c4a831a4b7d1b1f34176a29a3f28845af639eb9b1c88dd40000.js' // Nxy Cash
import _57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000 from '../tdd/57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000.js' // Ava's Cash
import _70a290bdbfdfbd2bacd01959d6acbfca431d3f5047863769da8564211ea00000 from '../tdd/70a290bdbfdfbd2bacd01959d6acbfca431d3f5047863769da8564211ea00000.js' // TRILLION CARBON
import _9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000 from '../tdd/9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000.js' // Studio Time + Collection
import _a15c9e7e68170259fd31bc26610b542625c57e13fdccb5f3e1cb7fb03a420000 from '../tdd/a15c9e7e68170259fd31bc26610b542625c57e13fdccb5f3e1cb7fb03a420000.js' // Nexa Exchange Loyalty
import _a535ef8ceae8135121ad7bc70712e02d56d8c2a3964877f5cc5dbdf16f390000 from '../tdd/a535ef8ceae8135121ad7bc70712e02d56d8c2a3964877f5cc5dbdf16f390000.js' // AGNAR

/* Initialize (cached) list. */
const cachedList = [
    '5f2456fa44a88c4a831a4b7d1b1f34176a29a3f28845af639eb9b1c88dd40000', // Nxy Cash
    '57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000', // Ava's Cash
    '70a290bdbfdfbd2bacd01959d6acbfca431d3f5047863769da8564211ea00000', // TRILLION CARBON
    '9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000', // Studio Time + Collection
    'a15c9e7e68170259fd31bc26610b542625c57e13fdccb5f3e1cb7fb03a420000', // Nexa Exchange Loyalty
    'a535ef8ceae8135121ad7bc70712e02d56d8c2a3964877f5cc5dbdf16f390000', // AGNAR
]

/* Initialize (cached) handler. */
const cached = {
    '5f2456fa44a88c4a831a4b7d1b1f34176a29a3f28845af639eb9b1c88dd40000': _5f2456fa44a88c4a831a4b7d1b1f34176a29a3f28845af639eb9b1c88dd40000, // Nxy Cash
    '57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000': _57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000, // Ava's Cash
    '70a290bdbfdfbd2bacd01959d6acbfca431d3f5047863769da8564211ea00000': _70a290bdbfdfbd2bacd01959d6acbfca431d3f5047863769da8564211ea00000, // TRILLION CARBON
    '9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000': _9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000, // Studio Time + Collection
    'a15c9e7e68170259fd31bc26610b542625c57e13fdccb5f3e1cb7fb03a420000': _a15c9e7e68170259fd31bc26610b542625c57e13fdccb5f3e1cb7fb03a420000, // Nexa Exchange Loyalty
    'a535ef8ceae8135121ad7bc70712e02d56d8c2a3964877f5cc5dbdf16f390000': _a535ef8ceae8135121ad7bc70712e02d56d8c2a3964877f5cc5dbdf16f390000, // AGNAR
}

export default (_tokenid) => {
    /* Validate cached (token) list. */
    if (cachedList.includes(_tokenid)) {
        return cached[_tokenid]
    } else {
        return null
    }
}
