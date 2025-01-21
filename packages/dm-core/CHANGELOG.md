# Changelog

## [1.46.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.46.0...dm-core-v1.46.1) (2025-01-21)


### Bug Fixes

* jest import ([1f57ff6](https://github.com/equinor/dm-core-packages/commit/1f57ff648d94212fea688ae32208f3848025d7ef))


### Code Refactoring

* linting and package update fixes ([ac6a6d4](https://github.com/equinor/dm-core-packages/commit/ac6a6d4bfaa7defec261731628c8e4ad486e3137))
* update packages ([c102e64](https://github.com/equinor/dm-core-packages/commit/c102e6407678982bfebf338c3644de9a6ed38494))

## [1.46.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.45.1...dm-core-v1.46.0) (2024-06-19)


### Features

* add dm-core layout component ([d562f60](https://github.com/equinor/dm-core-packages/commit/d562f604e35f1d5247d9fee7120b2cbf77994b4f))
* minor global styles included in ApplicationProvider ([421752a](https://github.com/equinor/dm-core-packages/commit/421752a4592339232d2ca3a44ea456144418984c))


### Bug Fixes

* include application context in Tree ([266ff1b](https://github.com/equinor/dm-core-packages/commit/266ff1b8e564150322bf7c3c5ea675780450facf))
* InlineRecipeView doesn't stretch width ([f9fe604](https://github.com/equinor/dm-core-packages/commit/f9fe604f253d085564a06c29a6372793b5b8e0e6))
* move dnd packages to correct project ([1b52856](https://github.com/equinor/dm-core-packages/commit/1b528566b2fcebfcd676f48cd463b12c951a3cc8))


### Miscellaneous Chores

* remove autoprefixer package ([ec891ff](https://github.com/equinor/dm-core-packages/commit/ec891ff57e6ee9ec8ce2f16faa0066f9cf0cb7ec))
* remove tailwind from dm-core ([ecbe5dc](https://github.com/equinor/dm-core-packages/commit/ecbe5dce742ecdddee3c78b969d7c318c2311ad2))


### Code Refactoring

* ACL components tw removal + more cohesive design, remove unnecessary custom styled components ([253637d](https://github.com/equinor/dm-core-packages/commit/253637d840bd96eb042140ec5cf71890395bdfc1))
* remove margin treeview ([aa92e84](https://github.com/equinor/dm-core-packages/commit/aa92e84038eb1e469a8d10123d216dbf742977e5))
* remove tw classes on dm-core components ([3032c15](https://github.com/equinor/dm-core-packages/commit/3032c154fac126404732533516c21d4ce85ffbd5))
* remove tw from blueprint components ([60a0d93](https://github.com/equinor/dm-core-packages/commit/60a0d93c9c07a8b38dbde8b73f3d68d093f2973b))

## [1.45.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.45.0...dm-core-v1.45.1) (2024-05-31)


### Bug Fixes

* add react-query to correct package.json ([a2aa86a](https://github.com/equinor/dm-core-packages/commit/a2aa86aa935ff12e67094c776a258cf358ed7e1f))

## [1.45.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.44.1...dm-core-v1.45.0) (2024-05-31)


### Features

* export setError and allow throw actual error in useDocument ([fcdbd82](https://github.com/equinor/dm-core-packages/commit/fcdbd8294f53756aee3d7701d98bc401b1fbaa49))
* **yaml:** raw json edit ([70753eb](https://github.com/equinor/dm-core-packages/commit/70753eb41f7f9e88fada50c64c2c40e4a73fe24f))


### Bug Fixes

* **form-plugin:** reset form on changed document ([43afa8d](https://github.com/equinor/dm-core-packages/commit/43afa8d7a6b1f3cb6231ce147599f01797b9c2ea))
* **form:** wait for background fetch ([d448ea5](https://github.com/equinor/dm-core-packages/commit/d448ea553873178b34b5e760d2ec0670e444e91f))
* **header:** Automatically clear blueprint cache ([d8cc86b](https://github.com/equinor/dm-core-packages/commit/d8cc86b952003fdfaed7b538d089327bd7954ba6))
* missing type in updateDocument ([bfb2a73](https://github.com/equinor/dm-core-packages/commit/bfb2a733ddcbc5f8f38c9d17949463ddfa088fac))


### Performance Improvements

* use tanstack query to cache attribute and useDocument requests ([3865373](https://github.com/equinor/dm-core-packages/commit/3865373a5b09f14fd86b4ba19e55e4fc86564946))


### Code Refactoring

* move throwError param to individual function, not hook ([5a95b94](https://github.com/equinor/dm-core-packages/commit/5a95b94e3c7b4ddee65b46d4139c7ae2bdc7669f))

## [1.44.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.44.0...dm-core-v1.44.1) (2024-05-16)


### Miscellaneous Chores

* update generated API ([c76a52b](https://github.com/equinor/dm-core-packages/commit/c76a52bd25344576b5b5ccf9c648fcaec2bb9db8))

## [1.44.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.43.3...dm-core-v1.44.0) (2024-05-10)


### Features

* **explorer:** menu item to 'view raw' (yaml and basic edit) ([fa495f0](https://github.com/equinor/dm-core-packages/commit/fa495f041460fd67ee8e23d32547ab0cccaa268c))


### Code Refactoring

* clean up TreeView component ([ea56ef2](https://github.com/equinor/dm-core-packages/commit/ea56ef257bc965f5406cfa8e827fea646332b75d))
* remove deprecated components ([af27b61](https://github.com/equinor/dm-core-packages/commit/af27b61270376426be89779621f36b5c6f3cc290))

## [1.43.3](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.43.2...dm-core-v1.43.3) (2024-03-19)


### Code Refactoring

* dm-core to dm-core-plugins migration ([d484717](https://github.com/equinor/dm-core-packages/commit/d4847175e913cd5a953fe6b7402e8c4774eb808a))
* fix remaining imports ([a051942](https://github.com/equinor/dm-core-packages/commit/a051942a464594566559a54443438c3b56c064a1))
* move CopyLinkDialog to dm-core ([b8a5ee3](https://github.com/equinor/dm-core-packages/commit/b8a5ee3c16b2ac4387723a018ec743ec673d9ad7))

## [1.43.2](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.43.1...dm-core-v1.43.2) (2024-03-15)


### Bug Fixes

* comile straight to dist folder ([fa3616f](https://github.com/equinor/dm-core-packages/commit/fa3616fe10129ea40d4ea3cb9242c8e3d9aa52b7))
* don't copy to dist until after build ([9668333](https://github.com/equinor/dm-core-packages/commit/966833346a062bd1550bb710cd7d6964f6151d32))
* test separating build calls ([4aaac7d](https://github.com/equinor/dm-core-packages/commit/4aaac7d95e9bd7607e9d3287e578f528065b2250))


### Miscellaneous Chores

* always use latest eds versions ([c5363b8](https://github.com/equinor/dm-core-packages/commit/c5363b8bac26f2b4a3548a94696af3ca7d957e52))


### Code Refactoring

* remove dm-plugins styles from dm-core and only use tailwind ([46504b6](https://github.com/equinor/dm-core-packages/commit/46504b6e6611494be1c3c75e5b2c65076cc59b6f))
* tailwind build cleanup ([fc58075](https://github.com/equinor/dm-core-packages/commit/fc580752aa414352e7f1ba5265818ead1d42100e))

## [1.43.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.43.0...dm-core-v1.43.1) (2024-03-15)


### Bug Fixes

* can't click name on dropdown ([20023cc](https://github.com/equinor/dm-core-packages/commit/20023cc228c92529287856db74ce9e1ffb8bf4f6))
* edsbutton overflow minor fix ([a037718](https://github.com/equinor/dm-core-packages/commit/a0377186a27cbd942ba59820bef46706fc4fef54))
* less inline padding in table row ([349bf45](https://github.com/equinor/dm-core-packages/commit/349bf4587da90fc32c337ec7d7bafe1c88c45154))
* **sidebar:** reload on navigation ([4026408](https://github.com/equinor/dm-core-packages/commit/402640814597265ecc397a09057784e9112bcbf7))
* **viewCreator:** cache reference calculation ([74d2b2e](https://github.com/equinor/dm-core-packages/commit/74d2b2e8f76d04aa8ae58c338d29eaa67329a41a))


### Code Refactoring

* unnecessary test ([7a7fba9](https://github.com/equinor/dm-core-packages/commit/7a7fba929856261b35529db96a93d9f8ad83ccdd))

## [1.43.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.42.2...dm-core-v1.43.0) (2024-03-11)


### Features

* job control styling improvements ([d4abeb6](https://github.com/equinor/dm-core-packages/commit/d4abeb6404af6bf62c4976b637bb01b9745ae349))

## [1.42.2](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.42.1...dm-core-v1.42.2) (2024-03-08)


### Bug Fixes

* Dialog got height 0 on webkit(safari) ([f102e85](https://github.com/equinor/dm-core-packages/commit/f102e85178ba4eba62304c726174b8df00e184f5))
* make clear work ([8139c58](https://github.com/equinor/dm-core-packages/commit/8139c5861d756455952dd24771c143c7dd6a789e))
* tooltip and remove console.log ([4a06358](https://github.com/equinor/dm-core-packages/commit/4a06358b5ceba4c0ea84bbe8db6429f59e43f879))


### Code Refactoring

* merge all contexts into one ([f602af8](https://github.com/equinor/dm-core-packages/commit/f602af8404c2010259d6277afbaf5cb45a042409))

## [1.42.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.42.0...dm-core-v1.42.1) (2024-03-04)


### Bug Fixes

* added testid to refresh button ([63c7c07](https://github.com/equinor/dm-core-packages/commit/63c7c07d13dd43e16f3020c7d7caf14903790777))

## [1.42.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.41.0...dm-core-v1.42.0) (2024-03-01)


### Features

* add message component to project ([3c1c368](https://github.com/equinor/dm-core-packages/commit/3c1c36871d59422a51f193b602ef193d17946e6d))
* don't use index for address of item when 'ensureUID' ([901c76f](https://github.com/equinor/dm-core-packages/commit/901c76f4cb1a7c068f0f2af814f75be06dc711da))
* **publish:** copy and link mode ([8d8de10](https://github.com/equinor/dm-core-packages/commit/8d8de106bbac3301f83ddb2498602d4c31f18dae))


### Bug Fixes

* formatting ([5700ff4](https://github.com/equinor/dm-core-packages/commit/5700ff430f8a7e8b0ff3a9b84df5c6dc5914a608))
* table overflow bug and adding tooltip to job runner ([5700ff4](https://github.com/equinor/dm-core-packages/commit/5700ff430f8a7e8b0ff3a9b84df5c6dc5914a608))


### Miscellaneous Chores

* remove tailwind test classes ([b5b729b](https://github.com/equinor/dm-core-packages/commit/b5b729b1f17658d9306439589b01658d82b77d1b))


### Code Refactoring

* dm-plugin-wrapper -&gt; dm-plugin-padding ([e862c63](https://github.com/equinor/dm-core-packages/commit/e862c634ee05e17c07ca888cdc1bc115332da761))
* layout and styling cleanup ([ac2eb9a](https://github.com/equinor/dm-core-packages/commit/ac2eb9afde1527f0b0393b37ebd680b9a8ee8342))
* wrapper -&gt; flex-layout-container ([825f64f](https://github.com/equinor/dm-core-packages/commit/825f64fdebf29f1f66b4fb0c786f6430533f1ddc))

## [1.41.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.40.1...dm-core-v1.41.0) (2024-02-23)


### Features

* allow revert table changes in edit mode ([61d8d4b](https://github.com/equinor/dm-core-packages/commit/61d8d4b7e2b5659da2e176b46670dcd30e3b895f))


### Bug Fixes

* **job:** a few minor bugs in scheduler ui ([dbde777](https://github.com/equinor/dm-core-packages/commit/dbde777e16a594156aa75d7669c7452ae5e5bba1))

## [1.40.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.40.0...dm-core-v1.40.1) (2024-02-19)


### Code Refactoring

* expect and use contentType from document + use main type checks ([0745285](https://github.com/equinor/dm-core-packages/commit/0745285b06f6a9f8c08a2b6559c92fcdf0a48ba9))
* only show new tab when supported contenttype ([d6585d5](https://github.com/equinor/dm-core-packages/commit/d6585d571d11230888e270540ab385e2f561e35e))

## [1.40.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.39.6...dm-core-v1.40.0) (2024-02-15)


### Features

* create showDescription attribute ([c898f1b](https://github.com/equinor/dm-core-packages/commit/c898f1b1b903047f66060c2c56d477997ae8fef0))
* **publish:** add meta and publish plugins ([eea5411](https://github.com/equinor/dm-core-packages/commit/eea54117aeadba2633ae5509eee70b14028ce83b))


### Bug Fixes

* add missing description ([cd31c7b](https://github.com/equinor/dm-core-packages/commit/cd31c7bd2f2bec680eb6ef4defd8269dcf6d423c))
* hide meta when disabled ([ff2ae16](https://github.com/equinor/dm-core-packages/commit/ff2ae160ad240a77c8cefc77024465baac41ef43))

## [1.39.6](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.39.5...dm-core-v1.39.6) (2024-02-12)


### Bug Fixes

* another linting issue ([233d328](https://github.com/equinor/dm-core-packages/commit/233d328a504768171705c0c4f29a4d62574e72fd))
* linting and import issues ([18b67e8](https://github.com/equinor/dm-core-packages/commit/18b67e8baaeb63a465273c268fa390d2dfede79b))
* only pre-fetch files we can preview, otherwise fetch on download ([c070272](https://github.com/equinor/dm-core-packages/commit/c070272679499827de6d01e9df2581eabb5450ee))
* remove unused download attribute, rename function ([e336309](https://github.com/equinor/dm-core-packages/commit/e3363091bcd7be9ee257c41530019b3cae77626f))
* **table:** indexing problem ([d5d6f4a](https://github.com/equinor/dm-core-packages/commit/d5d6f4acdfe4bca3becf7b52ef59b7791dc9daf4))


### Code Refactoring

* extract syntethic download to reusable function ([19ae691](https://github.com/equinor/dm-core-packages/commit/19ae6913ec2eb7766bf4f62b8c2beb53ede939f7))
* restructure MediaContent component ([37ce86b](https://github.com/equinor/dm-core-packages/commit/37ce86b620e05702690b0cb56353e224b36797a1))

## [1.39.5](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.39.4...dm-core-v1.39.5) (2024-02-08)


### Bug Fixes

* form crashing bug ([77118b7](https://github.com/equinor/dm-core-packages/commit/77118b7c3a8df8e8ba8b605c6286563cddf86f5e))
* skeleton rows also want keys ([61bfb64](https://github.com/equinor/dm-core-packages/commit/61bfb648cb0c64219e85609e02070c739a03dc1a))

## [1.39.4](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.39.3...dm-core-v1.39.4) (2024-02-08)


### Bug Fixes

* actually fix horisontal sroll on table ([605c638](https://github.com/equinor/dm-core-packages/commit/605c63853abbc54a9ba0ddd1fe7554d82aee7754))
* adding skeletons to table ([17c634f](https://github.com/equinor/dm-core-packages/commit/17c634fdec05c42e54beaf038dfce7de14e85e23))
* correct cells based on enabled functionality + pagination styling ([830c4be](https://github.com/equinor/dm-core-packages/commit/830c4be4687011e6f59bc535ce7b670eed5328ea))
* datepicker calendar ([2062133](https://github.com/equinor/dm-core-packages/commit/206213322a2eb979d73b6da7a663150cce3ca907))
* okdsfd ([448ecbf](https://github.com/equinor/dm-core-packages/commit/448ecbf5637c69459ac422440bb190b5691e7588))
* popovers always on top ([44ed0f5](https://github.com/equinor/dm-core-packages/commit/44ed0f502ff3d9390a2a6e76afaecb12793bf93d))
* remove config options ([4432060](https://github.com/equinor/dm-core-packages/commit/44320603d36d6b287d59a4a1bdd8a8c72f9b28ac))
* scroll bar always there pagination bug ([98482eb](https://github.com/equinor/dm-core-packages/commit/98482ebee8bf9ae7f2b7535427b8f8dcdc6321f1))
* skeleton custom component and padding issues ([448ecbf](https://github.com/equinor/dm-core-packages/commit/448ecbf5637c69459ac422440bb190b5691e7588))
* table expand bug ([a524237](https://github.com/equinor/dm-core-packages/commit/a524237ac2bb5f52574c0404b2cc14098ec40b8e))
* table spans 100% of width ([efd222a](https://github.com/equinor/dm-core-packages/commit/efd222a796b8f4ed0a1f5b22e7af98d3f0b7017c))
* table-horitontal-scroll ([63ed68c](https://github.com/equinor/dm-core-packages/commit/63ed68c703ee8ff26bb5fef4982d3921fd6b1991))
* **table-list-width:** config ([a8a27f6](https://github.com/equinor/dm-core-packages/commit/a8a27f6810ee64b70f0483cf65bca1212c37b9c6))
* work in progress ([6d0b9d2](https://github.com/equinor/dm-core-packages/commit/6d0b9d292f2c1f83e5a4583086c4940ed37a9fb2))
* work in progress ([a9464a9](https://github.com/equinor/dm-core-packages/commit/a9464a940609cfa7c53b315bf4175036dfb032e4))


### Code Refactoring

* better variable naming ([366e5b3](https://github.com/equinor/dm-core-packages/commit/366e5b33ef3bcc028f5d8231d833dde051d0635a))

## [1.39.3](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.39.2...dm-core-v1.39.3) (2024-02-02)


### Bug Fixes

* make refresh button container full widh + height ([da80332](https://github.com/equinor/dm-core-packages/commit/da803320249af38d84fa9eccba058221f3badc82))

## [1.39.2](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.39.1...dm-core-v1.39.2) (2024-02-02)


### Bug Fixes

* make refresh button appear again ([53c2d03](https://github.com/equinor/dm-core-packages/commit/53c2d031d20e323988e45e5ccd4c50b1ee34d4f8))
* **table:** fixed nb locale for table datetime ([29e5e58](https://github.com/equinor/dm-core-packages/commit/29e5e58bdd6ed34b05b2fbf0e6a838f5d3e73e8d))

## [1.39.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.39.0...dm-core-v1.39.1) (2024-02-01)


### Bug Fixes

* content in table not using full width ([13e94dd](https://github.com/equinor/dm-core-packages/commit/13e94dd9fcb761ebed728e02520783da2813ec67))
* datepicker does not open when edit as text ([d665240](https://github.com/equinor/dm-core-packages/commit/d6652407819c4c289b82b227d8dab675b6060460))
* **entityPicker:** hide checkbox for list nodes ([bd3b82e](https://github.com/equinor/dm-core-packages/commit/bd3b82e0baebe7780ed93f95b3988e6f3c49b62e))
* loading ui ([53ae35c](https://github.com/equinor/dm-core-packages/commit/53ae35c46915957b062141d73a29294830facbbe))
* table hover gray no more ([c51d8df](https://github.com/equinor/dm-core-packages/commit/c51d8df0ce8a856a16a5ab141341f059c6d7dfb8))


### Miscellaneous Chores

* disable blueprint cache by config ([02f0a53](https://github.com/equinor/dm-core-packages/commit/02f0a538718e605738bd7841d658ae10f61085bb))

## [1.39.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.38.0...dm-core-v1.39.0) (2024-01-31)


### Features

* **table:** support for datetime dataTypes ([a0b26e0](https://github.com/equinor/dm-core-packages/commit/a0b26e0fec60acec7839a09745cce9145369c9b5))


### Bug Fixes

* **datepicker:** popover is now a portal on body. Always visible ([5cdb9f6](https://github.com/equinor/dm-core-packages/commit/5cdb9f655b8e357b7997946efa2bba3126621fd2))


### Tests

* fix bad calendar test ([608377d](https://github.com/equinor/dm-core-packages/commit/608377dfba1a4a8666a83fc74e5c6f5ae58326ff))

## [1.38.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.37.0...dm-core-v1.38.0) (2024-01-30)


### Features

* configure fixed grid size with panning ([911b452](https://github.com/equinor/dm-core-packages/commit/911b452306b5c4decac04835761fb5c5faa37c11))

## [1.37.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.36.2...dm-core-v1.37.0) (2024-01-29)


### Features

* pass up selected month ([8e80b2b](https://github.com/equinor/dm-core-packages/commit/8e80b2be99070ad2fd8ed4761678ddbe122ea7a8))


### Bug Fixes

* other highligt color ([01b8a92](https://github.com/equinor/dm-core-packages/commit/01b8a92ff7488b5d06bc07e2c396c049a04facaf))
* remove comments ([01b8a92](https://github.com/equinor/dm-core-packages/commit/01b8a92ff7488b5d06bc07e2c396c049a04facaf))
* slight ui changes ([a60482f](https://github.com/equinor/dm-core-packages/commit/a60482f4a5fd7d95be6bbad60a9eaa001d2f15cf))
* small ball under date to signify hasData ([01b8a92](https://github.com/equinor/dm-core-packages/commit/01b8a92ff7488b5d06bc07e2c396c049a04facaf))


### Performance Improvements

* cache api calls ([5ea768d](https://github.com/equinor/dm-core-packages/commit/5ea768d4b6bbc838d8611bab7a6d971ebd2a84cc))


### Styles

* min width for copy dialog ([b9268b4](https://github.com/equinor/dm-core-packages/commit/b9268b4e36c24d5a2082c73ff2a7ca80200dba5c))

## [1.36.2](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.36.1...dm-core-v1.36.2) (2024-01-25)


### Bug Fixes

* bold and underline if has data ([3694336](https://github.com/equinor/dm-core-packages/commit/3694336a6200352cff95c26634358b8744abfe73))
* bold on dates with data ([954db49](https://github.com/equinor/dm-core-packages/commit/954db49a30051495744f172a8bf921d32e562f05))


### Code Refactoring

* rename to isHighlighted ([82be8d7](https://github.com/equinor/dm-core-packages/commit/82be8d7e4193241a8acbfed4b2104d11903f5ca6))

## [1.36.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.36.0...dm-core-v1.36.1) (2024-01-25)


### Bug Fixes

* need to resolve more to get attributes ([41f1482](https://github.com/equinor/dm-core-packages/commit/41f14822259362670bcfbb85d20070996f008cc9))

## [1.36.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.35.1...dm-core-v1.36.0) (2024-01-25)


### Features

* copy entity also sets meta ([fcd0045](https://github.com/equinor/dm-core-packages/commit/fcd00456b505ae29d3c19b11a0f824e47141cee0))
* CopyDialog can now hide provided fields and overwrite title ([e4ab822](https://github.com/equinor/dm-core-packages/commit/e4ab82202a5321e9e39bdf42349985b38c26fa4c))


### Bug Fixes

* scroll horizontally on entire app ([df4b741](https://github.com/equinor/dm-core-packages/commit/df4b741b2030e32dab7818927b203c5d4d475640))

## [1.35.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.35.0...dm-core-v1.35.1) (2024-01-24)


### Bug Fixes

* sldkfj ([8cb561f](https://github.com/equinor/dm-core-packages/commit/8cb561f990827c5aa0032348214018a512e563e0))
* table one cell bug ([8ef8ad9](https://github.com/equinor/dm-core-packages/commit/8ef8ad9ddceea007f482404c38b29d3204b1ba8c))


### Code Refactoring

* order keys ([8cb561f](https://github.com/equinor/dm-core-packages/commit/8cb561f990827c5aa0032348214018a512e563e0))
* reorder keys ([8cb561f](https://github.com/equinor/dm-core-packages/commit/8cb561f990827c5aa0032348214018a512e563e0))

## [1.35.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.34.2...dm-core-v1.35.0) (2024-01-23)


### Features

* copy or link dialog in Explorer ([d5e88e2](https://github.com/equinor/dm-core-packages/commit/d5e88e22f17ae079f981fbf2b1dd5ac650260506))


### Bug Fixes

* bug with negative page ([a5c6458](https://github.com/equinor/dm-core-packages/commit/a5c6458bf5adc3bc69f71d6a8e672b3380db4e9d))
* new nasdlkfj ([a5c6458](https://github.com/equinor/dm-core-packages/commit/a5c6458bf5adc3bc69f71d6a8e672b3380db4e9d))
* tests ([a5c6458](https://github.com/equinor/dm-core-packages/commit/a5c6458bf5adc3bc69f71d6a8e672b3380db4e9d))

## [1.34.2](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.34.1...dm-core-v1.34.2) (2024-01-23)


### Bug Fixes

* add form context only to the form wich controls submit ([fea9005](https://github.com/equinor/dm-core-packages/commit/fea90050bd93b6c4f8a7971daad71ca3184ae9db))
* export ([61c1a76](https://github.com/equinor/dm-core-packages/commit/61c1a76aec9c0409271c527f54dc390c04f68a0a))
* lazyload using component ([61c1a76](https://github.com/equinor/dm-core-packages/commit/61c1a76aec9c0409271c527f54dc390c04f68a0a))
* new list butotn ([76dbad4](https://github.com/equinor/dm-core-packages/commit/76dbad42fa7165891b556ac704f4cc5f84f649ea))
* new list button ([76dbad4](https://github.com/equinor/dm-core-packages/commit/76dbad42fa7165891b556ac704f4cc5f84f649ea))
* replace temporary template resolver with common ([912b448](https://github.com/equinor/dm-core-packages/commit/912b448e14495bc696c7f10a10e71526d0d7f7a1))
* scroll when extending parent container ([014ed92](https://github.com/equinor/dm-core-packages/commit/014ed92445231880484b36d050b675406d47c739))
* test? ([61c1a76](https://github.com/equinor/dm-core-packages/commit/61c1a76aec9c0409271c527f54dc390c04f68a0a))

## [1.34.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.34.0...dm-core-v1.34.1) (2024-01-19)


### Bug Fixes

* minor ui changes to icons in table ([#1151](https://github.com/equinor/dm-core-packages/issues/1151)) ([933a52a](https://github.com/equinor/dm-core-packages/commit/933a52a4533a65e1025a4199b53c863ea5255da4))


### Styles

* let biome handle imports ([af8634d](https://github.com/equinor/dm-core-packages/commit/af8634d0fe8c41c0f8b850923d59ea2e958be7d7))

## [1.34.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.33.1...dm-core-v1.34.0) (2024-01-17)


### Features

* **job:** create job plugin supports templates ([78d6b37](https://github.com/equinor/dm-core-packages/commit/78d6b370230d0917080051fddab8be777e638a2e))


### Bug Fixes

* wrapping in mediaView text box ([cb9cb6e](https://github.com/equinor/dm-core-packages/commit/cb9cb6ec3126cc3a0046a19f1f2af835b6f10d14))

## [1.33.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.33.0...dm-core-v1.33.1) (2024-01-12)


### Bug Fixes

* optional showmeta for mediaviewer ([1f86085](https://github.com/equinor/dm-core-packages/commit/1f860855a8be19b0dffece8300d1ed9b8fa94e9e))


### Tests

* added view page for easier testing ([6b8ed5d](https://github.com/equinor/dm-core-packages/commit/6b8ed5d52bfc2fe27706d9ec33b19b1759267a9f))

## [1.33.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.32.1...dm-core-v1.33.0) (2024-01-12)


### Features

* name in new entity picker ([65d41bd](https://github.com/equinor/dm-core-packages/commit/65d41bd5f3f72525841b210592408f7f4c70ef19))


### Bug Fixes

* **job/control:** modify runner from template ([7b7d8c3](https://github.com/equinor/dm-core-packages/commit/7b7d8c3e201e473f276830946ea6efe4d7b12f68))
* rename to upload date ([936dec3](https://github.com/equinor/dm-core-packages/commit/936dec397993c0e66f190100b89fefc1bdbe079b))

## [1.32.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.32.0...dm-core-v1.32.1) (2024-01-10)


### Bug Fixes

* bad line break in p-tag. Missing image formats ([3221c14](https://github.com/equinor/dm-core-packages/commit/3221c14ea795bae76c905019fa62179ee47f15db))
* show number 0 values as actual 0s ([54623f1](https://github.com/equinor/dm-core-packages/commit/54623f16521bd518b2c6993139220c936ab5d472))

## [1.32.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.31.0...dm-core-v1.32.0) (2024-01-08)


### Features

* entity picker upgrades ([0c9576f](https://github.com/equinor/dm-core-packages/commit/0c9576f94c725805125bdab37c46f36213cc7c7a))


### Bug Fixes

* entity picker ([0c9576f](https://github.com/equinor/dm-core-packages/commit/0c9576f94c725805125bdab37c46f36213cc7c7a))

## [1.31.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.30.3...dm-core-v1.31.0) (2024-01-08)


### Features

* **media:** Meta information config ([#1037](https://github.com/equinor/dm-core-packages/issues/1037)) ([3de9c5a](https://github.com/equinor/dm-core-packages/commit/3de9c5a100d174613d7ff9b6b961a3ce269d3764))
* reenable ACL edit in menu ([4051e1d](https://github.com/equinor/dm-core-packages/commit/4051e1db1a592f7ab4999542f0627e79e49f7bf2))


### Bug Fixes

* **EntityPicker:** Only checkboxes clickable in 'multi-mode' ([e205d7f](https://github.com/equinor/dm-core-packages/commit/e205d7fa3f336f28d359759b56d13206c408ee5f))
* **ListPlugin:** 'selectFromScope' support relative addresses ([9845a44](https://github.com/equinor/dm-core-packages/commit/9845a44e0aad7a8f3503a2638b22b32b2e539cc5))
* select entity label as view label ([2546a93](https://github.com/equinor/dm-core-packages/commit/2546a937246785f93e231cb0a4fb624d6b07cfaa))
* table opens multiple tabs ([413d365](https://github.com/equinor/dm-core-packages/commit/413d365e71b84974e233e634185246ca87ce09b4))
* update existing viewitem on add ([e3f5740](https://github.com/equinor/dm-core-packages/commit/e3f574047c051560096128abb02caa3dd5aeb9f1))

## [1.30.3](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.30.2...dm-core-v1.30.3) (2023-12-21)


### Features

* better list padding + default pagination view ([#1048](https://github.com/equinor/dm-core-packages/issues/1048)) ([e4d9517](https://github.com/equinor/dm-core-packages/commit/e4d95176416191785a6e3a96b775ba8d34782c85))


### Bug Fixes

* also add to default ([e4d9517](https://github.com/equinor/dm-core-packages/commit/e4d95176416191785a6e3a96b775ba8d34782c85))
* error when selecting templates for uncontained ([#1044](https://github.com/equinor/dm-core-packages/issues/1044)) ([bc2469b](https://github.com/equinor/dm-core-packages/commit/bc2469bd11e5622d52b1eaf6c88c07ef37a2d1f6))
* make it now throw because config.templates is empty ([bc2469b](https://github.com/equinor/dm-core-packages/commit/bc2469bd11e5622d52b1eaf6c88c07ef37a2d1f6))
* pagination bug ([e4d9517](https://github.com/equinor/dm-core-packages/commit/e4d95176416191785a6e3a96b775ba8d34782c85))

## [1.30.2](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.30.1...dm-core-v1.30.2) (2023-12-20)


### Bug Fixes

* add indexLabel to list and table plugin ([21f20ef](https://github.com/equinor/dm-core-packages/commit/21f20ef09c4d718170cf683cf125ccbacc31e6f5))
* index start at one, caption override label ([21f20ef](https://github.com/equinor/dm-core-packages/commit/21f20ef09c4d718170cf683cf125ccbacc31e6f5))
* remove index from onOpen type ([21f20ef](https://github.com/equinor/dm-core-packages/commit/21f20ef09c4d718170cf683cf125ccbacc31e6f5))
* rename from caption to label ([21f20ef](https://github.com/equinor/dm-core-packages/commit/21f20ef09c4d718170cf683cf125ccbacc31e6f5))
* typo in description ([21f20ef](https://github.com/equinor/dm-core-packages/commit/21f20ef09c4d718170cf683cf125ccbacc31e6f5))
* undefined onOpen in table row props ([21f20ef](https://github.com/equinor/dm-core-packages/commit/21f20ef09c4d718170cf683cf125ccbacc31e6f5))

## [1.30.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.30.0...dm-core-v1.30.1) (2023-12-18)


### Bug Fixes

* multiple templates not save when add ([#1014](https://github.com/equinor/dm-core-packages/issues/1014)) ([812d44f](https://github.com/equinor/dm-core-packages/commit/812d44f8e614225970b378c9940409bc109f6d4f))

## [1.30.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.29.0...dm-core-v1.30.0) (2023-12-18)


### Features

* added reset button to all forms ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* some ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* submit button is diabled when no dirty stated ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))


### Bug Fixes

* ??? comment out test ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* border same color everywhere ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* can't get tests green ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* datepicker positioning ([#1003](https://github.com/equinor/dm-core-packages/issues/1003)) ([1e65097](https://github.com/equinor/dm-core-packages/commit/1e650975cdb5bf00d2b78ccd7fecf22e6034ca83))
* **datepicker:** input bugs ([#1001](https://github.com/equinor/dm-core-packages/issues/1001)) ([1c7a2b5](https://github.com/equinor/dm-core-packages/commit/1c7a2b5ca1cb87e318c1d22b4b2c8b788b80b4f6))
* dynaic sizing of primitive array header ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* filer out application roles not in azure if auth is used ([cdd8f9a](https://github.com/equinor/dm-core-packages/commit/cdd8f9a2466efde2ec2bc30dc54505566ab2bd6a))
* lightgreen ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* primitive array no item looks better now ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* reuse colors ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* selecting prev month date ([#1002](https://github.com/equinor/dm-core-packages/issues/1002)) ([e87a6e4](https://github.com/equinor/dm-core-packages/commit/e87a6e4f6c464658371836016041096ed07a2f5f))
* some tetsing ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* tesets ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* tests ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* tests ([24f770a](https://github.com/equinor/dm-core-packages/commit/24f770a766b373892fbf8d061ccbcbe328afc6e1))
* wrong color names ([#1004](https://github.com/equinor/dm-core-packages/issues/1004)) ([234c1e4](https://github.com/equinor/dm-core-packages/commit/234c1e47c403b68fbe3d7629c6a8557ee6340ebc))

## [1.29.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.28.0...dm-core-v1.29.0) (2023-12-18)


### Features

* relative example ([7e00392](https://github.com/equinor/dm-core-packages/commit/7e00392a307c0f5c47405ddb49cc02b07ca74b0a))

## [1.28.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.27.0...dm-core-v1.28.0) (2023-12-15)


### Features

* data grid ([3dc8c98](https://github.com/equinor/dm-core-packages/commit/3dc8c98529898ccf68db004af331721a3e4b63c0))
* multiple templates ([8499ca9](https://github.com/equinor/dm-core-packages/commit/8499ca9825e83c95758dd99adb5fa1af1041d254))


### Bug Fixes

* replace name which is empty string with attribute + index ([a8c7d40](https://github.com/equinor/dm-core-packages/commit/a8c7d40c8823fca1b072c779461d3517b353b478))

## [1.27.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.26.1...dm-core-v1.27.0) (2023-12-15)


### Features

* reusable colors in tailwind and styles ([57207c5](https://github.com/equinor/dm-core-packages/commit/57207c5408807415900aecb1801d6aced08c3bad))


### Bug Fixes

* add colors to dm-core-tailwind ([c36e5f5](https://github.com/equinor/dm-core-packages/commit/c36e5f52ff6772e57a8aa7c2baa55cf713669817))

## [1.26.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.26.0...dm-core-v1.26.1) (2023-12-14)


### Bug Fixes

* job label and close datepicker on click outside ([1911762](https://github.com/equinor/dm-core-packages/commit/191176236f9d9f221e3f70893fdeabc538b9f9fb))

## [1.26.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.25.0...dm-core-v1.26.0) (2023-12-13)


### Features

* provide template for new items in ListPlugin and TablePlugin ([44cc325](https://github.com/equinor/dm-core-packages/commit/44cc3253dbaf5891fc3c6fd030e5d4320de46544))

## [1.25.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.24.0...dm-core-v1.25.0) (2023-12-12)


### Features

* add form configs to job recipe ([b8168e2](https://github.com/equinor/dm-core-packages/commit/b8168e22c2154103290ca310ad7e589dc03cd2f3))
* **core:** Update EntityPicker to allow for multi select ([f911f85](https://github.com/equinor/dm-core-packages/commit/f911f855288cfeb57eca086422ab7a1047ad6b2b))
* open and expand arrays ([e8aaabc](https://github.com/equinor/dm-core-packages/commit/e8aaabcd6293511f25180479125a033ace1609fc))
* open and expand at same time ([2a7ad62](https://github.com/equinor/dm-core-packages/commit/2a7ad6265a0c2ca43497cde2c00f1f3a768892b2))
* primitive array refactor + feedback ([f5f4043](https://github.com/equinor/dm-core-packages/commit/f5f4043e4dd790a42816fb57271187794bfa7a45))


### Bug Fixes

* Creating new config object on every render breaks memo ([0ad4aed](https://github.com/equinor/dm-core-packages/commit/0ad4aed01021bbfdbb38586feeada2cfb38db380))
* default tab name on open ([f4dbea6](https://github.com/equinor/dm-core-packages/commit/f4dbea6df5d992893320493a517508c5aeaf7ec7))

## [1.24.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.23.0...dm-core-v1.24.0) (2023-12-09)


### Features

* add scope to columns ([2be1abf](https://github.com/equinor/dm-core-packages/commit/2be1abff5ed2c909cfad99984b842123c62b8753))
* better ui in fomr ([db607bb](https://github.com/equinor/dm-core-packages/commit/db607bb575baa282c9edd910bb421b71ef00f9e1))
* delete-hard-button ([df78468](https://github.com/equinor/dm-core-packages/commit/df784680b3ebc367bc658504d7c152d0b2312fbe))
* further iteration of form ui ([236fc65](https://github.com/equinor/dm-core-packages/commit/236fc65c88a5107283ee4bed229c796a338b5a6f))
* **job:** control existing jobs plugin ([afbb42d](https://github.com/equinor/dm-core-packages/commit/afbb42d70c4e17d6c1b83737d5d53b2ee66e566a))
* update table content on changes ([79abfed](https://github.com/equinor/dm-core-packages/commit/79abfed2bbfe2e59b579561e101a0f6ab819e4a5))


### Bug Fixes

* actually hide binaries ([#923](https://github.com/equinor/dm-core-packages/issues/923)) ([fa222b9](https://github.com/equinor/dm-core-packages/commit/fa222b9f9ae3289500698fd33bc9738fb7fc52af))
* add icon not found, use data object ([1115a0f](https://github.com/equinor/dm-core-packages/commit/1115a0f5e549607295826daf688f40d39a2d9745))
* broken sortables, now uses key extracted from item ([2b99a3e](https://github.com/equinor/dm-core-packages/commit/2b99a3e4e93fda5456c27c476960617c2e592618))
* click confirm delete in test ([d6d0ce5](https://github.com/equinor/dm-core-packages/commit/d6d0ce52e9d68eb3bf5b49ab03cb409d4e01b558))
* delete button popup remove after click delete ([f905a3a](https://github.com/equinor/dm-core-packages/commit/f905a3a3fc94586e521c5e02726f522974eaefb9))
* dont save the whole table on normal add ([33e3fb7](https://github.com/equinor/dm-core-packages/commit/33e3fb7fd382cbca111f7c5aa1c8ca9a668bb18d))
* failing tests, init fails ([151f3c9](https://github.com/equinor/dm-core-packages/commit/151f3c93c36c8f6d2889a2db7638bfa2b4483d40))
* refactor errors ([501cea8](https://github.com/equinor/dm-core-packages/commit/501cea8e98cdea9ddc88db4f1c85f70e37272183))
* SortableContext expects id, not key ([c052556](https://github.com/equinor/dm-core-packages/commit/c052556b8a619b709eb15712e7f7a41030e92b85))
* tests ([ca9fdad](https://github.com/equinor/dm-core-packages/commit/ca9fdad5eb8c05cdae6f50c86c5f2b22e57b1e75))
* unexpected amount of parameters in ListPlugin ([6875436](https://github.com/equinor/dm-core-packages/commit/6875436a655fdb8ee69428bdd4560ea8123119f4))

## [1.23.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.22.1...dm-core-v1.23.0) (2023-12-06)


### Features

* **Explorere:** Copy entiity address ([d9c9050](https://github.com/equinor/dm-core-packages/commit/d9c90500e8648150637c881659d6a7133a387faa))
* use same delete in table, move it to dm-core ([23df0be](https://github.com/equinor/dm-core-packages/commit/23df0bec5e31cc75c0af3bf49c262688e251714a))


### Bug Fixes

* hide binary again ([57bb65f](https://github.com/equinor/dm-core-packages/commit/57bb65f203d650d8f9b7c04b647886949c1e569d))
* revert more changes from biome PR ([62fd393](https://github.com/equinor/dm-core-packages/commit/62fd39309ee7427691aab3c4cdbd6ccbc9a71af1))

## [1.22.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.22.0...dm-core-v1.22.1) (2023-12-06)


### Bug Fixes

* fix some bugs ([#895](https://github.com/equinor/dm-core-packages/issues/895)) ([bdb3806](https://github.com/equinor/dm-core-packages/commit/bdb38066f47c9ae5923c3e0377c3cd125a14de70))

## [1.22.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.21.0...dm-core-v1.22.0) (2023-12-05)


### Features

* better blueprint picker ([0e5f5b7](https://github.com/equinor/dm-core-packages/commit/0e5f5b7ef42af588d37aed1830efe83dedc74859))
* role mapping ([a57ad18](https://github.com/equinor/dm-core-packages/commit/a57ad18ee183a4e9adfa27d8226bed74679adcf2))


### Bug Fixes

* fix some bugs ([#885](https://github.com/equinor/dm-core-packages/issues/885)) ([1821a79](https://github.com/equinor/dm-core-packages/commit/1821a79b02ec711914a51b86183eb6c2419acb21))

## [1.21.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.20.0...dm-core-v1.21.0) (2023-12-05)


### Features

* **datepicker:** Datepicker component ([#796](https://github.com/equinor/dm-core-packages/issues/796)) ([7389e38](https://github.com/equinor/dm-core-packages/commit/7389e382b5a6d22f553a40b0517026ce0476404a))
* update list item on change in expanded ([2bcf59d](https://github.com/equinor/dm-core-packages/commit/2bcf59d006ea5382d4cb4b606c1d5345c7bebae1))

## [1.20.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.19.0...dm-core-v1.20.0) (2023-11-30)


### Features

* add remove job dialog ([737d596](https://github.com/equinor/dm-core-packages/commit/737d5965f33f4f800593c5cd229105c72d05c96b))
* **job:** allow for explicit cron syntax ([461a3ca](https://github.com/equinor/dm-core-packages/commit/461a3caa372cc059545b191d96da651db1bf7c57))
* partial update ([d5b46ef](https://github.com/equinor/dm-core-packages/commit/d5b46ef7e420be3c4d75bc99a3d550ade2ca676e))
* recipebutton in viewconfig overrides reciepe ([320a215](https://github.com/equinor/dm-core-packages/commit/320a2156f89d5231ff964bdcefee171540d3ab9d))
* replace eslint and prettier with biome ([#826](https://github.com/equinor/dm-core-packages/issues/826)) ([ebcea46](https://github.com/equinor/dm-core-packages/commit/ebcea46d5c208e38b0799aaec4938bd2375b06fb))
* resfrehsable from viewConfig ([dde5483](https://github.com/equinor/dm-core-packages/commit/dde54835aa00df66e20c8db798c2117171fa85ee))


### Bug Fixes

* **TreeView:** Hide content of Files in tree ([2319df0](https://github.com/equinor/dm-core-packages/commit/2319df0a70e1aeb5d8ae16b1ba4db8e0d9d62fe4))
* upgrade docker compose version ([a163406](https://github.com/equinor/dm-core-packages/commit/a163406199d49f9f3a15af6a407f28cb8817e432))

## [1.19.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.18.0...dm-core-v1.19.0) (2023-11-28)


### Features

* add helper component ConditionalWrapper ([a0cf32b](https://github.com/equinor/dm-core-packages/commit/a0cf32b8e4af875fd0e2cbf657b7c72eec32ec21))
* add react-dnd to dm-core and create SortableList and SortableItem components ([7b85052](https://github.com/equinor/dm-core-packages/commit/7b850524bb6e022073d35129cb269aadd548588b))
* add Table component to dm-core ([952fdc6](https://github.com/equinor/dm-core-packages/commit/952fdc69ab9dcecf2980c50432ed3ae287f41f99))


### Bug Fixes

* expect api calls on server to be slower ([5b85878](https://github.com/equinor/dm-core-packages/commit/5b85878c627c5b8a332b3a5bd5d6c14dcaffe2df))
* unwanted div element in table, separated dnd context from list context ([328b764](https://github.com/equinor/dm-core-packages/commit/328b764607735414c50888ccdf1cf202e24a0fdd))

## [1.18.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.17.0...dm-core-v1.18.0) (2023-11-28)


### Features

* tailwindcss ([#786](https://github.com/equinor/dm-core-packages/issues/786)) ([1f8b5ef](https://github.com/equinor/dm-core-packages/commit/1f8b5ef5ee0dedb64f642a5a0c34d024458d441d))

## [1.17.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.16.0...dm-core-v1.17.0) (2023-11-27)


### Features

* add enum support ([62e5c50](https://github.com/equinor/dm-core-packages/commit/62e5c5028fd99083c7ed497df1f487310e82d3c8))


### Bug Fixes

* added roles and titles ([0a84c2d](https://github.com/equinor/dm-core-packages/commit/0a84c2d2dc79591a4207e9b3b6aad837b322e8b5))
* generate new job api and update job plugin new api ([4d5b53f](https://github.com/equinor/dm-core-packages/commit/4d5b53fc45226e1bd999e8c992e54a2b6b22c729))

## [1.16.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.15.0...dm-core-v1.16.0) (2023-11-22)


### Features

* **job:** create recurring job ([67f053b](https://github.com/equinor/dm-core-packages/commit/67f053b77438f2101102c52d1bbc7e05e8bac936))


### Bug Fixes

* **Dialog:** DialogActions float over content ([edf5460](https://github.com/equinor/dm-core-packages/commit/edf54602bb64692033a16f3039e893dd19b6834b))

## [1.15.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.14.0...dm-core-v1.15.0) (2023-11-21)


### Features

* add dropdown component ([#773](https://github.com/equinor/dm-core-packages/issues/773)) ([ec208de](https://github.com/equinor/dm-core-packages/commit/ec208debe8d53f0b80bb21f7cdfccb5169095d8c))

## [1.14.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.13.0...dm-core-v1.14.0) (2023-11-21)


### Features

* hotfix on wrong negation ([f08fb49](https://github.com/equinor/dm-core-packages/commit/f08fb4983d58e581968d1c87218ffa68568676ca))


### Bug Fixes

* bump dmss version to fix refresh button config ([f7e3137](https://github.com/equinor/dm-core-packages/commit/f7e3137ae401393064fba9dc0b06f9791c3fa8d9))


### Performance Improvements

* **EntityView:** stop plugin rerender on mouseEnter ([a70a174](https://github.com/equinor/dm-core-packages/commit/a70a174ef6f39371ed85c7126c051e069c3c8bdf))

## [1.13.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.12.0...dm-core-v1.13.0) (2023-11-21)


### Features

* default to false with refresh ([8027f6c](https://github.com/equinor/dm-core-packages/commit/8027f6c4ab8ace582199d7f73e9725c94848f129))
* refresh button ([386ef58](https://github.com/equinor/dm-core-packages/commit/386ef58b885a2685be2ae5652853fae486ff72c0))
* show loading when lazy load plugins ([072799c](https://github.com/equinor/dm-core-packages/commit/072799c8ab785848807ed939285fd12775fb215f))
* **view_select:** add sub menu ([cc76b64](https://github.com/equinor/dm-core-packages/commit/cc76b647c353c62efbf608664171bccd64f5a45b))


### Bug Fixes

* **form:** recipe name should be optional in ObjectField ([08adeb7](https://github.com/equinor/dm-core-packages/commit/08adeb743da6be25493066205f968d9af3227422))
* **style:** remove scroll overflow from refresh button ([2e00135](https://github.com/equinor/dm-core-packages/commit/2e00135d345cbd0ee1fc0f7a5ec305323ba8fd04))
* update dmss to make refreshButtonConfig work ([c22c285](https://github.com/equinor/dm-core-packages/commit/c22c28571cf484b44a7063ffc9c7cfe30a1e261b))

## [1.12.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.11.2...dm-core-v1.12.0) (2023-11-15)


### Features

* expandable job log ([#687](https://github.com/equinor/dm-core-packages/issues/687)) ([5895527](https://github.com/equinor/dm-core-packages/commit/5895527f0b992b975a2ff02cb894fd0dadc67154))


### Bug Fixes

* **blueprint:** fix several minor bugs in blueprint plugin ([eb4fba1](https://github.com/equinor/dm-core-packages/commit/eb4fba10cb0880aada8e9249c49ea27cc949e270))
* **blueprint:** some more pimpin of the blueprint plugin ([21da6d1](https://github.com/equinor/dm-core-packages/commit/21da6d1d1a850cef4ffa960fec3d49fff5337add))
* stop job poll on failed or completed status ([ccf833b](https://github.com/equinor/dm-core-packages/commit/ccf833b9dee4a76bb470108ea820363d4b1e456d))
* wrap recipe errors message in EntityView ([a81d8c4](https://github.com/equinor/dm-core-packages/commit/a81d8c49c1bdd4bfdfe9b9130ed148d1fbb3b6e3))

## [1.11.2](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.11.1...dm-core-v1.11.2) (2023-11-02)


### Bug Fixes

* disallow hat operator in scope ([6050d82](https://github.com/equinor/dm-core-packages/commit/6050d82a383fc7c45231a93134de138b39174bb7))

## [1.11.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.11.0...dm-core-v1.11.1) (2023-11-01)


### Bug Fixes

* allow multiple ways of defining scope ([884fe36](https://github.com/equinor/dm-core-packages/commit/884fe363e79f5a5f4f9abb9a07eb8736ac9b53a6))
* make job api provider use dm job api url from vite ([b553286](https://github.com/equinor/dm-core-packages/commit/b5532865b1633bb0f0980d49927618edef0aa3a2))

## [1.11.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.10.0...dm-core-v1.11.0) (2023-10-31)


### Features

* support for scheduling of cron jobs in JobPlugin ([8314879](https://github.com/equinor/dm-core-packages/commit/831487978af0666cce28feeaf51b8c318fe3462d))


### Bug Fixes

* integration test ([b4f71ad](https://github.com/equinor/dm-core-packages/commit/b4f71add3f34a8df02419e1c994a38862a34a846))

## [1.10.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.9.0...dm-core-v1.10.0) (2023-10-30)


### Features

* add list hook ([6eaea15](https://github.com/equinor/dm-core-packages/commit/6eaea1559f08d793186c00a8901c60523573afa7))
* add loading to actions ([d91a8b4](https://github.com/equinor/dm-core-packages/commit/d91a8b4f7ef789f1c1eb4fbe171b92dd1c383eec))
* add pagination ([98346d1](https://github.com/equinor/dm-core-packages/commit/98346d194e82f00c002a4d4c963a815dc3d1f970))
* save list ([9d35daf](https://github.com/equinor/dm-core-packages/commit/9d35dafe2b69e5fc4ae86de270ca01463e226ec1))
* support references ([ca909f0](https://github.com/equinor/dm-core-packages/commit/ca909f08a18028da4b9db53a9155cd3ae09d7aba))
* update attribute ([0e13cfb](https://github.com/equinor/dm-core-packages/commit/0e13cfbe18ff925497dc5f6ffaf28a10ea0563d7))
* update item ([db60b3b](https://github.com/equinor/dm-core-packages/commit/db60b3b6fbcc469223a598ba88dad1f149f4795b))
* **ViewCreator:** default to resolve target if it's a reference ([455f055](https://github.com/equinor/dm-core-packages/commit/455f05538e4b4b841c5d2f1fc247ab7823678fb5))

## [1.9.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.8.0...dm-core-v1.9.0) (2023-10-25)


### Features

* **ListPlugin:** expose 'selectFromScope' config parameter ([07b9429](https://github.com/equinor/dm-core-packages/commit/07b9429dde7ee7885ecf9712117f38609fe7f6f8))


### Bug Fixes

* **Tree:** ensure correct nodeID prefix ([e9019f0](https://github.com/equinor/dm-core-packages/commit/e9019f0b0723101477e3d511941682f941d99766))

## [1.8.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.7.0...dm-core-v1.8.0) (2023-10-24)


### Features

* **yaml:** interactive depth ([#640](https://github.com/equinor/dm-core-packages/issues/640)) ([2f50f8a](https://github.com/equinor/dm-core-packages/commit/2f50f8a6b4ad7f820150de9e16a80a5db3f91eba))


### Bug Fixes

* job pinger never stops ([#642](https://github.com/equinor/dm-core-packages/issues/642)) ([29715dd](https://github.com/equinor/dm-core-packages/commit/29715ddc0a53c236bf7abae78ad4a223c21fcecf))
* **jobPlugin:** multiple issues with jobPlugin ([405ca24](https://github.com/equinor/dm-core-packages/commit/405ca247d89e5f580617e05b444687b5319bb666))
* reset error in useJob after starting ([7012dfc](https://github.com/equinor/dm-core-packages/commit/7012dfcd316416158cd8841615fc2e32ba569d8c))

## [1.7.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.6.4...dm-core-v1.7.0) (2023-10-18)


### Features

* **list:** handle lists with uncontained items ([1ccd02b](https://github.com/equinor/dm-core-packages/commit/1ccd02bb5c746c9f0e617cf6065f7bf0a0dd5903))
* tree reference icon ([b5de37c](https://github.com/equinor/dm-core-packages/commit/b5de37c7a31dc858656c6f2063f10106ee8c99f0))

## [1.6.4](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.6.3...dm-core-v1.6.4) (2023-10-11)


### Bug Fixes

* Select correct recipes when switching views ([#610](https://github.com/equinor/dm-core-packages/issues/610)) ([88b8c8c](https://github.com/equinor/dm-core-packages/commit/88b8c8ca22238db2b0f033b90d63e79422c52a5f))

## [1.6.3](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.6.2...dm-core-v1.6.3) (2023-10-10)


### Bug Fixes

* make it possible to append to lists in explorer plugin ([4ce8bd2](https://github.com/equinor/dm-core-packages/commit/4ce8bd2bf1073b68b3ed940be42520228510a1fe))

## [1.6.2](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.6.1...dm-core-v1.6.2) (2023-10-10)


### Bug Fixes

* better style ([485cc1c](https://github.com/equinor/dm-core-packages/commit/485cc1c166f3ffbff473b6ec487af71c40b5ff99))

## [1.6.1](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.6.0...dm-core-v1.6.1) (2023-10-10)


### Bug Fixes

* add missing readme file ([008da81](https://github.com/equinor/dm-core-packages/commit/008da81ee849c47ef98d6b4d07d1886637f295c3))

## [1.6.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.5.0...dm-core-v1.6.0) (2023-10-06)


### Features

* .env variable and context for dm-job api ([#580](https://github.com/equinor/dm-core-packages/issues/580)) ([5dfd08e](https://github.com/equinor/dm-core-packages/commit/5dfd08ee16f4c7da90c278965c8bc51fdb3f20c8))
* test roles in test mode ([5c9b447](https://github.com/equinor/dm-core-packages/commit/5c9b447100c036482b9365f469797664a653f03f))

## [1.5.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.4.0...dm-core-v1.5.0) (2023-10-05)


### Features

* more generalized job plugin ([#565](https://github.com/equinor/dm-core-packages/issues/565)) ([6e98a92](https://github.com/equinor/dm-core-packages/commit/6e98a92689669e26c33827545f0c21ed14dfaed3))
* role based views ([243d3f4](https://github.com/equinor/dm-core-packages/commit/243d3f42db01d396eb93c97a7dbc9bf6ff51eda8))

## [1.4.0](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.3.4...dm-core-v1.4.0) (2023-10-02)


### Features

* **tree:** allow attribute paths as input ([#562](https://github.com/equinor/dm-core-packages/issues/562)) ([6a842e3](https://github.com/equinor/dm-core-packages/commit/6a842e3a276eec2683744b0b36af611cb4371cae)), closes [#534](https://github.com/equinor/dm-core-packages/issues/534)
* **tree:** make one init for everything ([#564](https://github.com/equinor/dm-core-packages/issues/564)) ([8510162](https://github.com/equinor/dm-core-packages/commit/851016217df16c2fd791f5279abfa55f4ae450aa))


### Bug Fixes

* don't allow switching table pages beyond what's available ([#553](https://github.com/equinor/dm-core-packages/issues/553)) ([e1f42bb](https://github.com/equinor/dm-core-packages/commit/e1f42bbde1a979964852e35a6a6a027cc9316924))

## [1.3.4](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.3.3...dm-core-v1.3.4) (2023-09-25)


### Bug Fixes

* **tree:** add svg title ([7480921](https://github.com/equinor/dm-core-packages/commit/7480921a9403a4888a93c7e7da134d04a3c23661))
* **tree:** allow node wrappers to open/close node ([db873c7](https://github.com/equinor/dm-core-packages/commit/db873c7da90ecc7c7d4e85a38387c087e89d3db3)), closes [#534](https://github.com/equinor/dm-core-packages/issues/534)
* **tree:** switch html structure from div to ul ([6120fa9](https://github.com/equinor/dm-core-packages/commit/6120fa983400c3f7adf66d8f3b531f243b1d8fac)), closes [#534](https://github.com/equinor/dm-core-packages/issues/534)

## [1.3.3](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.3.2...dm-core-v1.3.3) (2023-09-15)


### Bug Fixes

* **dialog:** improve layout ([608166e](https://github.com/equinor/dm-core-packages/commit/608166e736a7d934abc8eddc25c9027d97381e32))
* update types in FilePlugin.tsx ([b076717](https://github.com/equinor/dm-core-packages/commit/b07671748c4a98a8d41f0cad5096b75b2c932c51))

## [1.3.2](https://github.com/equinor/dm-core-packages/compare/dm-core-v1.3.1...dm-core-v1.3.2) (2023-09-01)


### Bug Fixes

* **job:** use check document existence endpoint to verify existence of job before updating, and add it if the job does not exist ([1e13f8c](https://github.com/equinor/dm-core-packages/commit/1e13f8cfdc6fc511b3fe4cccfefe0499ad0eb3ce))

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
