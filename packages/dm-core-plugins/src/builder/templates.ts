import { getBlock } from './blocks'
import { addWidget, createEmptyModel } from './model'
import type { TBuilderModel } from './types'

const block = (id: string) => {
  const found = getBlock(id)
  if (!found) throw new Error(`Unknown block: ${id}`)
  return found
}

export type TTemplate = {
  id: string
  label: string
  description: string
  build: () => TBuilderModel
}

/**
 * Starter page presets. Each builds a fresh model by placing widgets at fixed
 * grid areas, so applying a template yields a ready-to-edit layout.
 */
export const TEMPLATES: TTemplate[] = [
  {
    id: 'blank',
    label: 'Blank page',
    description: 'An empty canvas.',
    build: () => createEmptyModel(),
  },
  {
    id: 'landing',
    label: 'Landing page',
    description: 'A hero heading, a media banner and a supporting text column.',
    build: () => {
      let model = createEmptyModel()
      model = addWidget(model, block('text'), {
        rowStart: 1,
        rowEnd: 2,
        columnStart: 1,
        columnEnd: 12,
      })
      model = addWidget(model, block('image'), {
        rowStart: 3,
        rowEnd: 6,
        columnStart: 1,
        columnEnd: 8,
      })
      model = addWidget(model, block('text'), {
        rowStart: 3,
        rowEnd: 6,
        columnStart: 9,
        columnEnd: 12,
      })
      return model
    },
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'A header with two side-by-side data tables.',
    build: () => {
      let model = createEmptyModel()
      model = addWidget(model, block('text'), {
        rowStart: 1,
        rowEnd: 1,
        columnStart: 1,
        columnEnd: 12,
      })
      model = addWidget(model, block('table'), {
        rowStart: 2,
        rowEnd: 5,
        columnStart: 1,
        columnEnd: 6,
      })
      model = addWidget(model, block('table'), {
        rowStart: 2,
        rowEnd: 5,
        columnStart: 7,
        columnEnd: 12,
      })
      return model
    },
  },
  {
    id: 'article',
    label: 'Article',
    description: 'A title, a lead image and a body text column.',
    build: () => {
      let model = createEmptyModel()
      model = addWidget(model, block('text'), {
        rowStart: 1,
        rowEnd: 1,
        columnStart: 3,
        columnEnd: 10,
      })
      model = addWidget(model, block('image'), {
        rowStart: 2,
        rowEnd: 4,
        columnStart: 3,
        columnEnd: 10,
      })
      model = addWidget(model, block('text'), {
        rowStart: 5,
        rowEnd: 8,
        columnStart: 3,
        columnEnd: 10,
      })
      return model
    },
  },
]

export const getTemplate = (id: string): TTemplate | undefined =>
  TEMPLATES.find((template) => template.id === id)
