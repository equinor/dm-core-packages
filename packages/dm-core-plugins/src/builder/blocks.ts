import type { TBlock } from './types'

/**
 * The widget catalogue shown in the palette.
 *
 * - `layout` blocks (Section) are containers (a nested grid).
 * - `content` blocks (Heading, Text, Button, Divider, Spacer) render
 *   self-contained content from inline config — no DMSS binding needed.
 * - `media` blocks (Image, Video/Embed) show media from an uploaded file,
 *   bound scope, or an external URL.
 * - `data` blocks (Table, Form, Job, Metric, Chart) bind to an uploaded dataset
 *   or a DMSS entity via `scope`. The Job widget runs and monitors a bound Job
 *   entity. Metric and Chart are self-contained: their numbers are authored
 *   inline, but they live here because they visualise data.
 *
 * `defaultConfig` seeds a valid recipe config so a freshly dropped widget
 * renders in preview without manual setup. `fields` are block-specific
 * properties surfaced in the inspector; they target config keys the runtime
 * plugin actually consumes.
 */
export const BLOCKS: TBlock[] = [
  {
    id: 'section',
    label: 'Section',
    icon: 'view_module',
    category: 'layout',
    description: 'A container to group and arrange other widgets.',
    contentModel: 'content',
    defaultSize: { columns: 8, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/grid',
    defaultConfig: {
      size: { columns: 12, rows: 8, rowGap: '8px', columnGap: '8px' },
      items: [],
      itemBorder: { size: '1px', style: 'solid', color: '#bbb', radius: '5px' },
      showItemBorders: false,
    },
  },
  {
    id: 'heading',
    label: 'Heading',
    icon: 'title',
    category: 'content',
    description: 'A page title or section heading.',
    contentModel: 'content',
    defaultSize: { columns: 8, rows: 1 },
    recipe: '@development-framework/dm-core-plugins/static-heading',
    defaultConfig: { text: 'Heading', level: 2, align: 'left' },
    hideTitle: true,
    fields: [
      {
        label: 'Text',
        type: 'text',
        target: { kind: 'config', key: 'text' },
        help: 'The heading text shown on the page.',
      },
      {
        label: 'Level',
        type: 'select',
        target: { kind: 'config', key: 'level' },
        options: [
          { label: 'H1 — Largest', value: 1 },
          { label: 'H2', value: 2 },
          { label: 'H3', value: 3 },
          { label: 'H4', value: 4 },
          { label: 'H5', value: 5 },
          { label: 'H6 — Smallest', value: 6 },
        ],
        help: 'Heading level controls size and document outline.',
      },
      {
        label: 'Alignment',
        type: 'select',
        target: { kind: 'config', key: 'align' },
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
      {
        label: 'Color',
        type: 'text',
        target: { kind: 'config', key: 'color' },
        placeholder: '#333 or red',
        help: 'Text color (optional).',
      },
    ],
  },
  {
    id: 'text',
    label: 'Text',
    icon: 'text_field',
    category: 'content',
    description: 'Markdown rendered from a bound document.',
    contentModel: 'content',
    defaultSize: { columns: 6, rows: 2 },
    recipe: '@development-framework/dm-core-plugins/markdown',
    defaultConfig: { content: 'Write your text here.' },
    fields: [
      {
        label: 'Content',
        type: 'textarea',
        target: { kind: 'config', key: 'content' },
        help: 'Markdown text shown in this widget. Bind a Scope instead to use a document.',
      },
    ],
  },
  {
    id: 'button',
    label: 'Button',
    icon: 'link',
    category: 'content',
    description: 'A call-to-action button that links somewhere.',
    contentModel: 'content',
    defaultSize: { columns: 3, rows: 1 },
    recipe: '@development-framework/dm-core-plugins/static-button',
    defaultConfig: { label: 'Click me', variant: 'contained', align: 'left' },
    hideTitle: true,
    fields: [
      {
        label: 'Label',
        type: 'text',
        target: { kind: 'config', key: 'label' },
        help: 'Text shown on the button.',
      },
      {
        label: 'Link (URL)',
        type: 'text',
        target: { kind: 'config', key: 'href' },
        placeholder: 'https://example.com',
        help: 'Where the button navigates when clicked.',
      },
      {
        label: 'Style',
        type: 'select',
        target: { kind: 'config', key: 'variant' },
        options: [
          { label: 'Filled', value: 'contained' },
          { label: 'Outlined', value: 'outlined' },
          { label: 'Text only', value: 'ghost' },
        ],
      },
      {
        label: 'Alignment',
        type: 'select',
        target: { kind: 'config', key: 'align' },
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
      {
        label: 'Open in new tab',
        type: 'boolean',
        target: { kind: 'config', key: 'openInNewTab' },
      },
    ],
  },
  {
    id: 'divider',
    label: 'Divider',
    icon: 'remove',
    category: 'content',
    description: 'A horizontal line to separate sections.',
    contentModel: 'content',
    defaultSize: { columns: 12, rows: 1 },
    recipe: '@development-framework/dm-core-plugins/static-divider',
    defaultConfig: { color: '#d8d8d8', thickness: 1, spacing: 8 },
    hideTitle: true,
    fields: [
      {
        label: 'Color',
        type: 'text',
        target: { kind: 'config', key: 'color' },
        placeholder: '#d8d8d8',
      },
      {
        label: 'Thickness (px)',
        type: 'number',
        target: { kind: 'config', key: 'thickness' },
      },
      {
        label: 'Spacing (px)',
        type: 'number',
        target: { kind: 'config', key: 'spacing' },
        help: 'Empty space above and below the line.',
      },
    ],
  },
  {
    id: 'spacer',
    label: 'Spacer',
    icon: 'keyboard_space_bar',
    category: 'content',
    description: 'Empty vertical space between widgets.',
    contentModel: 'content',
    defaultSize: { columns: 12, rows: 1 },
    recipe: '@development-framework/dm-core-plugins/static-spacer',
    defaultConfig: { height: 24 },
    hideTitle: true,
    fields: [
      {
        label: 'Height (px)',
        type: 'number',
        target: { kind: 'config', key: 'height' },
        help: 'How tall the empty space is.',
      },
    ],
  },
  {
    id: 'image',
    label: 'Image',
    icon: 'image',
    category: 'media',
    description: 'An image or other media asset from a bound file.',
    contentModel: 'content',
    defaultSize: { columns: 4, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/media-viewer',
    defaultConfig: { fill: 'width' },
    fields: [
      {
        label: 'Image',
        type: 'image-upload',
        target: { kind: 'config', key: 'address' },
        help: 'Browse your computer to upload an image, or bind a Scope to a file.',
      },
      {
        label: 'Caption',
        type: 'text',
        target: { kind: 'config', key: 'caption' },
        help: 'Text shown beneath the image.',
      },
      {
        label: 'Width (px)',
        type: 'number',
        target: { kind: 'config', key: 'width' },
        help: 'Fixed width in pixels (optional).',
      },
      {
        label: 'Height (px)',
        type: 'number',
        target: { kind: 'config', key: 'height' },
        help: 'Fixed height in pixels (optional).',
      },
    ],
  },
  {
    id: 'embed',
    label: 'Video / Embed',
    icon: 'play_circle',
    category: 'media',
    description: 'Embed a YouTube/Vimeo video or any external page.',
    contentModel: 'content',
    defaultSize: { columns: 6, rows: 5 },
    recipe: '@development-framework/dm-core-plugins/static-embed',
    defaultConfig: {},
    hideTitle: true,
    fields: [
      {
        label: 'URL',
        type: 'text',
        target: { kind: 'config', key: 'url' },
        placeholder: 'https://www.youtube.com/watch?v=…',
        help: 'YouTube and Vimeo share links are converted automatically.',
      },
      {
        label: 'Title',
        type: 'text',
        target: { kind: 'config', key: 'title' },
        help: 'Accessible title for the embedded frame.',
      },
    ],
  },
  {
    id: 'table',
    label: 'Table',
    icon: 'table_chart',
    category: 'data',
    description: 'A table you fill in by hand or from a CSV/Excel file.',
    contentModel: 'content',
    defaultSize: { columns: 8, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/static-table',
    defaultConfig: {
      rows: [
        ['Column A', 'Column B'],
        ['Row 1', 'Value'],
        ['Row 2', 'Value'],
      ],
      pageSize: 25,
    },
    fields: [
      {
        label: 'Data',
        type: 'table-source',
        target: { kind: 'config', key: 'rows' },
        help: 'Write the table as markdown, or import a CSV/Excel file. Large files are paginated.',
      },
      {
        label: 'Rows per page',
        type: 'number',
        target: { kind: 'config', key: 'pageSize' },
        help: 'How many rows to show per page.',
      },
    ],
  },
  {
    id: 'form',
    label: 'Form',
    icon: 'list',
    category: 'data',
    description: 'An editable form bound to an entity.',
    contentModel: 'data',
    defaultSize: { columns: 6, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/form',
  },
  {
    id: 'job',
    label: 'Job',
    icon: 'play',
    category: 'data',
    description:
      'Run and monitor a job — start it, schedule it, and read logs.',
    contentModel: 'data',
    defaultSize: { columns: 6, rows: 4 },
    recipe: '@development-framework/dm-core-plugins/job',
    defaultConfig: {
      type: 'PLUGINS:dm-core-plugins/job/ControlConfig',
      hideLogs: false,
    },
    fields: [
      {
        label: 'Title',
        type: 'text',
        target: { kind: 'config', key: 'title' },
        help: 'Heading shown above the job controls.',
      },
      {
        label: 'Hide logs',
        type: 'boolean',
        target: { kind: 'config', key: 'hideLogs' },
        help: 'Hide the streamed job log output.',
      },
    ],
  },
  {
    id: 'metric',
    label: 'Metric',
    icon: 'functions',
    category: 'data',
    description: 'A single big-number KPI computed from a list of values.',
    contentModel: 'content',
    defaultSize: { columns: 3, rows: 2 },
    recipe: '@development-framework/dm-core-plugins/static-metric',
    defaultConfig: {
      label: 'Average',
      values: '12, 18, 9, 24, 15',
      aggregation: 'mean',
      decimals: 2,
    },
    hideTitle: true,
    fields: [
      {
        label: 'Label',
        type: 'text',
        target: { kind: 'config', key: 'label' },
        help: 'Caption shown above the number.',
      },
      {
        label: 'Values',
        type: 'textarea',
        target: { kind: 'config', key: 'values' },
        placeholder: '12, 18, 9, 24, 15',
        help: 'Numbers separated by commas, spaces or new lines. Non-numbers are ignored.',
      },
      {
        label: 'Calculation',
        type: 'select',
        target: { kind: 'config', key: 'aggregation' },
        options: [
          { label: 'Average (mean)', value: 'mean' },
          { label: 'Sum', value: 'sum' },
          { label: 'Minimum', value: 'min' },
          { label: 'Maximum', value: 'max' },
          { label: 'Median', value: 'median' },
          { label: 'Std. deviation', value: 'stddev' },
          { label: 'Count', value: 'count' },
        ],
        help: 'How the values are reduced to a single number.',
      },
      {
        label: 'Unit',
        type: 'text',
        target: { kind: 'config', key: 'unit' },
        placeholder: '%, kg, ms…',
        help: 'Optional unit shown after the number.',
      },
      {
        label: 'Decimals',
        type: 'number',
        target: { kind: 'config', key: 'decimals' },
        help: 'Number of decimal places to display.',
      },
      {
        label: 'Color',
        type: 'text',
        target: { kind: 'config', key: 'color' },
        placeholder: '#243746',
        help: 'Color of the big number (optional).',
      },
      {
        label: 'Alignment',
        type: 'select',
        target: { kind: 'config', key: 'align' },
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },
    ],
  },
]

export const getBlock = (id: string): TBlock | undefined =>
  BLOCKS.find((block) => block.id === id)
