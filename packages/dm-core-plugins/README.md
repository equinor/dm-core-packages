# dm-core-plugins

## How to add a new plugin

To add a new plugin to dm-core-plugins, a new folder with the new plugin's name must be added inside
the `dm-core-plugins/src` folder.

The folder must at least include a nameOfPlugin.tsx file, where the main React component for the plugin
should
be placed.
The type of the props to the plugin component should be `IUIPlugin`.

You should also add a README.md file that explains what the plugin does, and how to use it.

If the plugin requires any special blueprints, those should be added to the
dm-core-plugins/blueprints/nameOfPlugin folder.

In order to make your plugin available to users that have installed the `@development-framework/dm-core-plugins` through
npm, you must also add your plugin to the `dm-core-plugins/src/index.tsx` file.