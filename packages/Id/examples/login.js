/* Import modules. */
import { login } from '../index.js' // use @nexajs/id in production

;(async () => {
    console.log('Login Example')
    console.log(await login())
})()
