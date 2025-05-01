import { RemixBrowser } from '@remix-run/react'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

async function enableAPIMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return 
  }

    const { browserWorker } = await import('./mocks/browser')

    await browserWorker.start()
  
}

enableAPIMocking().then(() => {
  startTransition(() => {
    hydrateRoot(document, <RemixBrowser />)
  })
}).catch((error) => {
  console.error('Failed to start API mocking:', error)
})

