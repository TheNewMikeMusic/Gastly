import path from 'node:path'
import { fileURLToPath } from 'node:url'

import dotenv from 'dotenv'
import { getFourPXClient } from '../lib/fourpx.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function main() {
  const trackingNumber = process.argv[2]

  if (!trackingNumber) {
    console.error('Usage: npx ts-node scripts/test-fourpx.ts <trackingNumber> [destinationCountry] [postalCode]')
    process.exit(1)
  }

  const destinationCountry = process.argv[3]
  const postalCode = process.argv[4]

  const client = getFourPXClient()

  if (!client.isConfigured) {
    throw new Error('FOURPX credentials are missing. Check .env.local.')
  }

  const response = await client.track({
    trackingNumber,
    countryCode: destinationCountry,
    postalCode,
  })

  console.log(JSON.stringify(response, null, 2))
}

main().catch((error) => {
  console.error('4PX tracking request failed:')
  console.error(error)
  process.exit(1)
})
