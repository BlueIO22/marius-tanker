import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'marius-tanker',

  projectId: 'afqsdc5q',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), unsplashImageAsset()],

  schema: {
    types: schemaTypes,
  },
})
