import * as fs from 'fs'
import * as path from 'path'

import * as YAML from 'js-yaml'
import remark from 'remark'
import withFootnotes from 'remark-footnotes'
import withFrontmatter from 'remark-frontmatter'
import withGitHubMarkdown from 'remark-gfm'
import visit from 'unist-util-visit'
import vfile from 'vfile'
import { remarkMarkAndUnravel as withUnraveledJsxChildren } from 'xdm/lib/plugin/remark-mark-and-unravel.js'
import { remarkMdx as withMdx } from 'xdm/lib/plugin/remark-mdx.js'

function withMigratedMetadata() {
  return transformer

  function transformer(tree, file) {
    visit(tree, 'yaml', onYaml)

    function onYaml(node) {
      const frontmatter = YAML.load(String(node.value), {
        schema: YAML.CORE_SCHEMA,
      })

      if (!frontmatter.domain) {
        frontmatter.domain = 'Social Sciences and Humanities'
      }
      if (!frontmatter.targetGroup) {
        frontmatter.targetGroup = 'Domain researchers'
      }

      node.value = YAML.dump(frontmatter, {
        schema: YAML.CORE_SCHEMA,
        quotingType: '"',
        sortKeys: true,
      }).trim()
    }
  }
}

async function main() {
  const processor = remark()
    .use({
      settings: {
        bullet: '-',
        emphasis: '_',
        fences: true,
        incrementListMarker: true,
        listItemIndent: 'one',
        resourceLink: true,
        rule: '-',
        strong: '*',
      },
    })
    .use(withMdx)
    .use(withUnraveledJsxChildren)
    .use(withFrontmatter)
    .use(withGitHubMarkdown)
    .use(withFootnotes)
    .use(withMigratedMetadata)

  const postsFolder = path.join(process.cwd(), 'content', 'resources')
  const fileNames = fs.readdirSync(postsFolder)

  fileNames.forEach((fileName) => {
    const filePath = path.join(postsFolder, fileName)

    const file = vfile({
      contents: fs.readFileSync(filePath, { encoding: 'utf-8' }),
      path: filePath,
    })

    const processedFile = processor.processSync(file)

    fs.writeFileSync(path.join(filePath), String(processedFile), {
      encoding: 'utf-8',
    })
  })
}

main()
