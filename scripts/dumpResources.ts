import * as fs from 'fs'
import * as path from 'path'

import { getEventPreviews } from '@/api/cms/event'
import { getPostPreviews } from '@/api/cms/post'
import { log } from '@/utils/log'

/**
 * Dumps resource metadata to public folder as json.
 */
async function main() {
  const locale = 'en'
  const outputFolder = path.join(process.cwd(), 'public', 'resources')

  const resources = await getPostPreviews(locale)
  const events = await getEventPreviews(locale)

  const resourcesFilePath = path.join(outputFolder, 'resources.json')
  const eventsFilePath = path.join(outputFolder, 'events.json')

  fs.mkdirSync(outputFolder, { recursive: true })
  fs.writeFileSync(resourcesFilePath, JSON.stringify({ resources }), {
    encoding: 'utf-8',
  })
  fs.writeFileSync(eventsFilePath, JSON.stringify({ events }), {
    encoding: 'utf-8',
  })
}

main()
  .then(() =>
    log.success('Successfully dumped resource metadata to public folder.'),
  )
  .catch(log.error)
