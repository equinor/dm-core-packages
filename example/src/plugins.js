export default [
  { plugins: import('@development-framework/yaml-view') },
  { plugins: import('@development-framework/blueprint') },
  { plugins: import('@development-framework/default-pdf') },
  { plugins: import('@development-framework/form') },
  // 'validationBlueprintsPackage' points to a folder in DMSS where the plugins blueprints have been uploaded
  {
    plugins: import('@development-framework/tabs'),
    validationBlueprintsPackage: 'DemoDataSource/DemoPackage/Plugins/PDF',
  },
  { plugins: import('@development-framework/header') },
  { plugins: import('@development-framework/explorer') },
]
