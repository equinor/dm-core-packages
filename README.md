<!-- markdownlint-configure-file {
  "MD013": {
    "code_blocks": false,
    "tables": false
  },
  "MD033": false,
  "MD041": false
} -->

<div align="center">

# Data Modeling Core Packages

[![License][license-badge]][license]
[![On push main branch][on-push-main]][on-push-main]

Contains the core package and UI plugins.

[Libraries](#libraries)•
[Quickstart](#quickstart) •
[Development](#development) •
[Contributing](#contributing)

</div>

<a id="libraries"></a>
## :dart: Libraries

See under `packages/` for list of available plugins or [NPM](https://www.npmjs.com/search?q=%40development-framework).

<a id="quickstart"></a>
## :zap: Quickstart

First, install the plugins:

```
yarn install @development-framework/dm-core-plugins
```

Add the installed plugins to the `src/plugins.js` file.

```
import dmCorePlugins from '@development-framework/dm-core-plugins'

export default {
  ...dmCorePlugins
}
```

<a id="development"></a>
## :dizzy: Development

See the [example](https://github.com/equinor/dm-core-packages/tree/main/example) if you want to start developing.

<a id="Contributing"></a>
## :+1: Contributing


[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[license]: https://github.com/equinor/dm-core-packages/blob/main/LICENSE
[releases]: https://github.com/equinor/dm-core-packages/releases
[on-push-main]: https://github.com/equinor/dm-core-packages/actions/workflows/on-push.yaml/badge.svg
[on-push-main]: https://github.com/equinor/dm-core-packages/actions/workflows/on-push.yaml