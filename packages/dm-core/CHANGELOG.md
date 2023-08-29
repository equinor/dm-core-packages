# Changelog

## [1.3.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.3.0...dm-core-v1.3.1) (2023-08-29)


### Bug Fixes

* gen-job-api runs on port 5001 ([c076026](https://github.com/equinor/dm-core-packages/commit/c0760269d016f05b64fea427042b3d73af8fa300))
* initFromFolder in tree not working ([374e2c7](https://github.com/equinor/dm-core-packages/commit/374e2c752bade855dc881a56d281ae0d7068c422))
* ran genereate apis ([3083e7e](https://github.com/equinor/dm-core-packages/commit/3083e7e210dbcdc3f352cbeddbe9c354f2148363))
* rename accesscontrollist to fix double naming issue ([501873a](https://github.com/equinor/dm-core-packages/commit/501873a19181cd3afba9f7a223cf495535d928b1))

## [1.3.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.2.0...dm-core-v1.3.0) (2023-08-24)


### Features

* add option to select attribute in entity picker ([d010261](https://github.com/equinor/dm-core-packages/commit/d010261c95af7dff3ecf2a1fc1afce17c8e19fff))
* run azure container jobs in signal app ([2293577](https://github.com/equinor/dm-core-packages/commit/229357722942996bb904ebb8d10ddf7dde83f464))


### Bug Fixes

* added pagination button title ([215522c](https://github.com/equinor/dm-core-packages/commit/215522cfabcdf9a333833b5b9bce72a76fb687fe))
* do not add primitive types as separate nodes in tree ([aa1827b](https://github.com/equinor/dm-core-packages/commit/aa1827b9fef3a26345e88f8e34f883f15b68bc47))
* export plugins by default ([e82bbd4](https://github.com/equinor/dm-core-packages/commit/e82bbd48249e1d205383b2818f576656b80c6ebe))
* raise error on missing uiPluginContext ([308598c](https://github.com/equinor/dm-core-packages/commit/308598cbb0736138c8e47d4559c1d252d8e067c7))
* remove pluginName from TPlugin type ([45ac86b](https://github.com/equinor/dm-core-packages/commit/45ac86be4490bbb118e659cd3b43086aaf803309))
* removing notificationmanager and replacing with toast ([08155c4](https://github.com/equinor/dm-core-packages/commit/08155c400dd522483ad82d30346cdbb6b9dfc87f))
* set wait for timeout after submit form ([9747bc3](https://github.com/equinor/dm-core-packages/commit/9747bc38d5e57aa679d425f6a0e3d584f5988063))
* update docs in subcomponents of JobPlugin ([99324f6](https://github.com/equinor/dm-core-packages/commit/99324f69ca17238344ae6c7c8a43c064f0a58e3c))
* use correct address when returning link reference from  EntityPickerButton ([0030b52](https://github.com/equinor/dm-core-packages/commit/0030b520ceed700b60e576bf4bb239c1b59b14a7))

## [1.2.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.1.2...dm-core-v1.2.0) (2023-07-10)


### Features

* add CreateJobEntity and JobForm component ([b070fb0](https://github.com/equinor/dm-core-packages/commit/b070fb087c7356f8e3b8814b1183de73e2660037))


### Bug Fixes

* bug in truncatePathString ([f339fc9](https://github.com/equinor/dm-core-packages/commit/f339fc913490bd7bb3b6fe249e200ce4f32c4982))
* handle relative reference in form ([7aab5e6](https://github.com/equinor/dm-core-packages/commit/7aab5e677b0a8e1bd2f2263da6927693194a104d))
* support /DS/&lt;path&gt; syntax in getDataSourceIdFromReference() ([f018894](https://github.com/equinor/dm-core-packages/commit/f01889484888f71eafcee2916e7b6cdb4cc0d05c))
* update setJobIsStarted state in Stop button in JobControl.tsx ([02c4518](https://github.com/equinor/dm-core-packages/commit/02c4518427dab2d2eb1498b0cb0374a477d08b29))

## [1.1.2](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.1.1...dm-core-v1.1.2) (2023-06-30)


### Bug Fixes

* use new dmss API in dm-core and dm-core-packages ([94247ff](https://github.com/equinor/dm-core-packages/commit/94247fff84533f29733cf0c3677b54a1360f6658))

## [1.1.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.1.0...dm-core-v1.1.1) (2023-06-29)


### Bug Fixes

* bug with opening lists in tree ([5a7a13b](https://github.com/equinor/dm-core-packages/commit/5a7a13b0bc91ca5e6099d6262df26237fc82ad98))

## 1.1.0 (2023-06-29)


### Features

* accept rootId param in addView function ([858fff5](https://github.com/equinor/dm-core-packages/commit/858fff571d5c7a40bf98038944b6cead1a42f8be))
* add 'initialRecipeSelector' and SidebarRecipeSelector ([53ce741](https://github.com/equinor/dm-core-packages/commit/53ce7416b72c3a2bafae02ccc8acc2ba47dae7ab))
* add form plugin ([9243089](https://github.com/equinor/dm-core-packages/commit/924308966f641409a9b27a2dbb8446c6fc5aa444))
* add pagination component to dm-core ([aa08e26](https://github.com/equinor/dm-core-packages/commit/aa08e26f58ae72d36d35c5fa351972cb58c586f7))
* add view creator component ([4935eb9](https://github.com/equinor/dm-core-packages/commit/4935eb9bd14b1210394a2da410609525e734d798))
* **attribute-selector:** configure content with ViewConfigs ([779c609](https://github.com/equinor/dm-core-packages/commit/779c609b26a93a3bf95fe8c2fa872eac54995458))
* export global css file for use in external projects ([548e510](https://github.com/equinor/dm-core-packages/commit/548e510c5f0923e30b15d8afdb6f602c19ac3c17))
* generic entity viewer ([87e97bb](https://github.com/equinor/dm-core-packages/commit/87e97bbbd1a7d80cc21f4d19a949319e8c04851c))
* **generic-list:** added generic list plugin ([121e070](https://github.com/equinor/dm-core-packages/commit/121e070703c7c40dd22126e79aeae2e47efd5ec6))
* **generic-list:** remove and add items ([b58a45c](https://github.com/equinor/dm-core-packages/commit/b58a45cc580747b327ad611e63ec71a41be0d4f6))
* **generic-list:** support view concept ([20be9b2](https://github.com/equinor/dm-core-packages/commit/20be9b2d83ec9ed830890ee2f3cd51d58843d5b5))
* **grid:** add support for nested scope path ([4240c06](https://github.com/equinor/dm-core-packages/commit/4240c06e6b0e63eb1ff43516b317a189620e9891))
* implementation of yarn workspaces and fix node_modules bugs ([5f72fb6](https://github.com/equinor/dm-core-packages/commit/5f72fb6ae67574553ed0fdb462ca676730d75c59))
* introduce Stack component (flexbox) for spacing of elements ([bcd53c3](https://github.com/equinor/dm-core-packages/commit/bcd53c3035fee22ba85743b356f2440b712e6707))
* make EntityPickerButton able to pick reference to entity ([5ba00bd](https://github.com/equinor/dm-core-packages/commit/5ba00bd3636a9f0300c81125a1fb65add954d0a8))
* **object-table:** editable and viewmode for table of objects ([8c62d06](https://github.com/equinor/dm-core-packages/commit/8c62d061a15b479e939760badebe1f61370baf94))
* playwright node ([3d73924](https://github.com/equinor/dm-core-packages/commit/3d73924b6e5a8f760667e08bb5947935fdf7340c))
* support files ([9b8b3d3](https://github.com/equinor/dm-core-packages/commit/9b8b3d37f55a75a8f08bc7858ccdaa10b08a3b70))
* **UiRecipeSelector:** support view concept ([9ebc973](https://github.com/equinor/dm-core-packages/commit/9ebc97372445b92f1271c57497fbc24e84ab27d6))
* update useBlueprint with new response layout ([c00c993](https://github.com/equinor/dm-core-packages/commit/c00c99372718b797a310fe4c562d2323628e62be))
* use recipe hook ([ce77576](https://github.com/equinor/dm-core-packages/commit/ce77576ed00f7701ea044017052013a3271a7aa9))
* useJob hook ([3fd23d2](https://github.com/equinor/dm-core-packages/commit/3fd23d205c617d05c247c6783379454ddd479efc))
* **ViewCreator:** update to handle views with no recipe ([69587d2](https://github.com/equinor/dm-core-packages/commit/69587d2eb8629bbd07eb086a81bb615aa2644ae7))


### Bug Fixes

* add protocol when adding entity ([5a47169](https://github.com/equinor/dm-core-packages/commit/5a47169e1ff979e557558272d242b7960c8751a2))
* add type for exported plugins from applications ([5f3b9bc](https://github.com/equinor/dm-core-packages/commit/5f3b9bc4048c56c03f0b8c208be70e4e13a9fdcb))
* add type to document in useDocument ([356ddf8](https://github.com/equinor/dm-core-packages/commit/356ddf8462df161e36baf9308c8c992ad95564dc))
* avoid eslint failure ([9153d02](https://github.com/equinor/dm-core-packages/commit/9153d0284ec04b5d95e7eaaa762e8de14170244b))
* better error handing in attribute selector ([457c73f](https://github.com/equinor/dm-core-packages/commit/457c73fcd9716d90c1ae73ac6328d7745c45452e))
* **blueprint:** bad main file for blueprint plugin ([d39d8a0](https://github.com/equinor/dm-core-packages/commit/d39d8a0c6df2e24dcbd56c46131965d365025f51))
* bugs with tree ([c2b2623](https://github.com/equinor/dm-core-packages/commit/c2b26230f9b691623dbdc7b107faa66339c5cd83))
* content of sidebar now fills available space ([fa06164](https://github.com/equinor/dm-core-packages/commit/fa06164a7a863d0608e0f5f142a0110c84018520))
* **core:** add the config attribute to UiRecipe ([a240472](https://github.com/equinor/dm-core-packages/commit/a24047205599eddba02fc8144bca0397d1cbd3a4))
* **core:** create blueprint with name ([13e64df](https://github.com/equinor/dm-core-packages/commit/13e64df38be6f1571039dbffb649ea4081d7d1a8))
* **core:** update on changed DMSS api ([cbf2d41](https://github.com/equinor/dm-core-packages/commit/cbf2d4124d1cd02a33efe3ba9b0b0fc7ea79143f))
* **core:** wrong path for blueprint enums ([ff50fb5](https://github.com/equinor/dm-core-packages/commit/ff50fb5dcda2ec2604f4e17b5d1d22e8bfa136f1))
* export useDataSources ([152df9b](https://github.com/equinor/dm-core-packages/commit/152df9b2c07796cfb5870c3b84d5f5a16a98f4c6))
* export useLocalStorage ([3928414](https://github.com/equinor/dm-core-packages/commit/392841442e2d1d7169193cac8166587682d318d2))
* export useSearch hook ([009825d](https://github.com/equinor/dm-core-packages/commit/009825d77e4370ce8d72f2472046cf4e5c42cc5f))
* find recipe after loading finished ([ffdb287](https://github.com/equinor/dm-core-packages/commit/ffdb287523cbd073daf8dc40417fc5e962029cc8))
* **form:** fix a bug where form continued with bad state ([effb475](https://github.com/equinor/dm-core-packages/commit/effb475d65bd40ab4ee0a549024559e845bb6e74))
* **grid:** pass type to grid elements ([12777ee](https://github.com/equinor/dm-core-packages/commit/12777ee7ee6afa3dc9ae7fbe500e14191f80c68c))
* handle entity name when using DMSS' instantiateEntity endpoint in newEntityButton ([c932c11](https://github.com/equinor/dm-core-packages/commit/c932c116a18c13b9fefea27fff6b97f23ef5452e))
* handle scope with more than 1 level ([e4a1ede](https://github.com/equinor/dm-core-packages/commit/e4a1edea17d585829400a3e6fa123f4927a3ffc7))
* import in example app ([5a47169](https://github.com/equinor/dm-core-packages/commit/5a47169e1ff979e557558272d242b7960c8751a2))
* include initialRecipe for name search. New list query syntax ([7140912](https://github.com/equinor/dm-core-packages/commit/714091223b47855e34eb552cb24a5c1017a4bd61))
* loading bug in tree ([14b562f](https://github.com/equinor/dm-core-packages/commit/14b562f675ea4794a8f77ee7a988426e05e8dd41))
* remove UiRecipesSideBarSelector and RecipeSelector (replaced with attribute-selector plugin) ([a52cd10](https://github.com/equinor/dm-core-packages/commit/a52cd107ac180b0758ba2505ae26a1185a145dba))
* remove unused dependencies in explorer package ([5a47169](https://github.com/equinor/dm-core-packages/commit/5a47169e1ff979e557558272d242b7960c8751a2))
* scope with index to item in array ([f3d3c61](https://github.com/equinor/dm-core-packages/commit/f3d3c610aab1c6d97f9e237cc36a566bc466384d))
* styling of popup in explorer context menu and formatting ([5a47169](https://github.com/equinor/dm-core-packages/commit/5a47169e1ff979e557558272d242b7960c8751a2))
* tests ([b5c4bbf](https://github.com/equinor/dm-core-packages/commit/b5c4bbfe764083bfc7481da6a6cedcb874d976b5))
* ts errors with latest core version ([251aff3](https://github.com/equinor/dm-core-packages/commit/251aff3bf752efc20f14be0b4d7830e227ee635e))
* ui plugin switching in tree not working ([5a47169](https://github.com/equinor/dm-core-packages/commit/5a47169e1ff979e557558272d242b7960c8751a2))
* update API calls to dmss api ([c714d0a](https://github.com/equinor/dm-core-packages/commit/c714d0a0e9aa81d978d67f43d6971e050dfab049))
* update hardcoded types used ([cb54287](https://github.com/equinor/dm-core-packages/commit/cb5428752c41a6bed245282051f02f87ff1ce150))
* update TPlugin type ([ad7302e](https://github.com/equinor/dm-core-packages/commit/ad7302e4dbb09a46fcd2e298edaaef9eb84f1d8a))
* update tree on context menu delete action ([5a47169](https://github.com/equinor/dm-core-packages/commit/5a47169e1ff979e557558272d242b7960c8751a2))
* use correct DMSS url ([e6eeaeb](https://github.com/equinor/dm-core-packages/commit/e6eeaeb1f3cd7b184dc3605153570a9dbcd67993))
* **view-creator:** update onOpen type, optional type, etc. ([3eb2d60](https://github.com/equinor/dm-core-packages/commit/3eb2d603a3278122750cf8c98cc725e5ab663da0))
* **ViewCreator:** get type and dimensions from blueprints ([c2dc6de](https://github.com/equinor/dm-core-packages/commit/c2dc6de312ed64432f1e2b0631c17d1abe34b8e7))
* wrong blueprint key used in TreeNode ([b63593f](https://github.com/equinor/dm-core-packages/commit/b63593fa411fe7613fc0cc201e4b591392ab80ba))
