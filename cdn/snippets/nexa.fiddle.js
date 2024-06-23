/**
 * NexaJS JSFiddle Presentation Manager
 *
 * A helper package for JSFiddle demonstrations.
 *
 * Last updated: 2023.3.12
 */

const welcome = () => {
    console.log(`
Welcome to the Nexa (JS) Fiddle Presentation Manager
----------------------------------------------------

  Try a few useful commands:
    - console.log(Nexa)
    - Nexa.welcome()
`)
}

const html_header = `
<header>
  <h1 class="text-2xl">
    Title
  </h1>
</header>
`

/* Initialize Nexa header. */
const header = document.getElementById('nexa-header')
header.innerHTML = html_header

const html_footer = `
<footer>
  <h1 class="text-2xl">
    Copyright &copy; 2023. NexaJS developers. All rights reserved.
  </h1>
</footer>
`

/* Initialize Nexa footer. */
const footer = document.getElementById('nexa-footer')
footer.innerHTML = html_footer
