# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.6.2](https://github.com/Lutonite/heig-ddc-discord-bot/compare/v1.6.1...v1.6.2) (2024-02-19)


### Bug Fixes

* add framework config file in deployment ([005b2c1](https://github.com/Lutonite/heig-ddc-discord-bot/commit/005b2c11cf88494dc5758c912dae781925e75c93))
* **docker:** move sapphire import to runner stage ([99e01b8](https://github.com/Lutonite/heig-ddc-discord-bot/commit/99e01b8a432ca63640af22d5e393347d3f6719d7))

### [1.6.1](https://github.com/Lutonite/heig-ddc-discord-bot/compare/v1.6.0...v1.6.1) (2024-02-19)


### Bug Fixes

* **docker:** incorrect entrypoint with new build process ([b57e1d1](https://github.com/Lutonite/heig-ddc-discord-bot/commit/b57e1d1e16b3e107b4ee0ab459d9a7e4c15ad09b))

## [1.6.0](https://github.com/Lutonite/heig-ddc-discord-bot/compare/v1.5.0...v1.6.0) (2024-02-19)


### Features

* **event:** add ability to create class events using channel info ([8cd1b95](https://github.com/Lutonite/heig-ddc-discord-bot/commit/8cd1b95864311106e6a7d76658c4de704881bdd5)), closes [#10](https://github.com/Lutonite/heig-ddc-discord-bot/issues/10)


### Bug Fixes

* **menus:** adapt for new top chef api ([ef253b5](https://github.com/Lutonite/heig-ddc-discord-bot/commit/ef253b582a4ce73ff022bf54c51442edbb39d307))


### Others

* bump sapphire framework to v5 ([feda5b3](https://github.com/Lutonite/heig-ddc-discord-bot/commit/feda5b3abc8d8e1740a011dbd2791bb8fe20d537))

## [1.5.0](https://github.com/Lutonite/heig-ddc-discord-bot/compare/v1.4.1...v1.5.0) (2023-03-03)


### Features

* **cmd:help:** make help command chat-input runnable ([a2256ea](https://github.com/Lutonite/heig-ddc-discord-bot/commit/a2256eaba56400b2b230e5bb2c5cabe5aa9376af))
* **cmd:jhht:** add JHH time counter ([069cb86](https://github.com/Lutonite/heig-ddc-discord-bot/commit/069cb861f715df1299d037516698f711206f401e))
* **cmd:menus:** upgrade to new top-chef api ([ce2d101](https://github.com/Lutonite/heig-ddc-discord-bot/commit/ce2d101bb49f120a8f285abab88a682ebc5b4d3d)), closes [#15](https://github.com/Lutonite/heig-ddc-discord-bot/issues/15)
* **counters:** add abstractions for various types of counters ([17c00b8](https://github.com/Lutonite/heig-ddc-discord-bot/commit/17c00b8687fe6cb12d9b308c4996119efd8a926d)), closes [#3](https://github.com/Lutonite/heig-ddc-discord-bot/issues/3)
* **global:** command migration to d.js 14 ([5f60e78](https://github.com/Lutonite/heig-ddc-discord-bot/commit/5f60e7845ecf7506cc5b01d7e7636b5620ea5d1b))
* move quotes to type-safe firestore queries ([a3e14a8](https://github.com/Lutonite/heig-ddc-discord-bot/commit/a3e14a8b5bc84bc19283588a64f937f99f1ba0df))
* **twitch:** migrate to Twitch EventSub via WS ([70e9fda](https://github.com/Lutonite/heig-ddc-discord-bot/commit/70e9fda6e881af0bc17660f9b777813d0aa12a65)), closes [#19](https://github.com/Lutonite/heig-ddc-discord-bot/issues/19)


### Bug Fixes

* **counters:** move abstract counters out of commands parent folder ([a471424](https://github.com/Lutonite/heig-ddc-discord-bot/commit/a4714240cab00f856015e7951cce49c23918e91b))
* **sfv3-beers:** migrate beers to subcommands v3 ([fc23d5c](https://github.com/Lutonite/heig-ddc-discord-bot/commit/fc23d5c87f8a75de31aabdd973b2c84e7a37ea3e))
* **sfv3-dayjs-arg:** migrate dayjs argument type to @sapphire/result v2 ([1fc2fe7](https://github.com/Lutonite/heig-ddc-discord-bot/commit/1fc2fe7ff86abc26feee31f5a7620d40e9cca641))
* **sfv3-events:** upgrade listeners to new precondition events in framework v3 ([a60579e](https://github.com/Lutonite/heig-ddc-discord-bot/commit/a60579e7c5f9b05e5973ee633256e60ac36f616d))
* **sfv3-hw:** migrate homework to subcommands v3 ([ca83f95](https://github.com/Lutonite/heig-ddc-discord-bot/commit/ca83f957d076e041545064447efac52cc9ef3a1a))
* **sfv3-main:** load message and command listeners by default ([490b885](https://github.com/Lutonite/heig-ddc-discord-bot/commit/490b885cc2b08c6ab061e0807747cb513085204a))
* **sfv3-owner-precondition:** migrate owner-only precondition to framework v3 ([6a9100b](https://github.com/Lutonite/heig-ddc-discord-bot/commit/6a9100b68e335617af66ddbc977a8919e08480af))
* **sfv3-rrh:** migrate rrh to subcommands v3 ([9ef5a34](https://github.com/Lutonite/heig-ddc-discord-bot/commit/9ef5a34eb825b03d7c9d8082d97a63ae1f85179d))
* **sfv3-rrht:** migrate rrht to subcommands v3 ([6f7dc54](https://github.com/Lutonite/heig-ddc-discord-bot/commit/6f7dc54f5fa437e1cab1e64a34de9800ee4fc3a4))
* **sfv3-scheduled-tasks:** migrate to bullmq for @sapphire/plugin-scheduled-tasks v5 ([21e622a](https://github.com/Lutonite/heig-ddc-discord-bot/commit/21e622a84b7b93941ab640dc53d4a2acbca31cac))
* **ts-4.8:** firestore converter type should extend DocumentData ([d04176a](https://github.com/Lutonite/heig-ddc-discord-bot/commit/d04176aba167173acc2796a40ffd38e20e1fbb52))


### Others

* **cmd:time-counters:** adjust embed titles to describe what counter is referred ([51d98c8](https://github.com/Lutonite/heig-ddc-discord-bot/commit/51d98c8084e962583fe01089650c3ef103bfc5a2))
* **deps:** override jose for firebase-admin until release (resolves vuln) ([26eb17d](https://github.com/Lutonite/heig-ddc-discord-bot/commit/26eb17d62ae9e0b2ad61c997ec3ceafa20f1f529))
* **deps:** upgrade @sapphire/* for framework v3 ([4ff0dd5](https://github.com/Lutonite/heig-ddc-discord-bot/commit/4ff0dd56862274495e44d96327c4785864651160))
* **deps:** upgrade @twurple/* to v5.2.4 ([e3c1892](https://github.com/Lutonite/heig-ddc-discord-bot/commit/e3c1892d342c28cd419ee9f01ee3c8b782c167ae))
* **deps:** upgrade @types/node to v18.7.23 ([2e9e192](https://github.com/Lutonite/heig-ddc-discord-bot/commit/2e9e1923e5701e0d12cd52c1f7af88b692fe288a))
* **deps:** upgrade bull to v4.9.0 ([7153729](https://github.com/Lutonite/heig-ddc-discord-bot/commit/71537292a8c3a4f35d8a76e2b1b29b432f98a823))
* **deps:** upgrade commitizen to v4.2.5 ([d4c713c](https://github.com/Lutonite/heig-ddc-discord-bot/commit/d4c713c03592b58f854311d510154f2bc25b4282))
* **deps:** upgrade dayjs to v1.11.5 ([5ad677b](https://github.com/Lutonite/heig-ddc-discord-bot/commit/5ad677b042f30248f2b89935996c382861126a57))
* **deps:** upgrade deps and sapphire framework ([8571166](https://github.com/Lutonite/heig-ddc-discord-bot/commit/8571166a700d87d9cff917265800e1412fc47e98))
* **deps:** upgrade discord-api-types to v0.37.11 ([c5b1ecc](https://github.com/Lutonite/heig-ddc-discord-bot/commit/c5b1ecc8ed2e162cebdbf08891ed763c420ee002))
* **deps:** upgrade discord.js to v13.9.2 ([bb9c729](https://github.com/Lutonite/heig-ddc-discord-bot/commit/bb9c729f50f85cc1a35d5cdd2d872df03669bced))
* **deps:** upgrade dotenv to v16.0.2 ([9a88de9](https://github.com/Lutonite/heig-ddc-discord-bot/commit/9a88de96d842f99b9fb2b16c599533a2d983dd4c))
* **deps:** upgrade firebase-admin to v11.0.1 ([fa59434](https://github.com/Lutonite/heig-ddc-discord-bot/commit/fa594344cab57be8c25960795359854df253f967))
* **deps:** upgrade giphy api to v4.4.0 ([243edd2](https://github.com/Lutonite/heig-ddc-discord-bot/commit/243edd24528d18e4ca20f3fc9ab9023aa72f3d99))
* **deps:** upgrade ioredis to v5.2.3 ([d3c4ca4](https://github.com/Lutonite/heig-ddc-discord-bot/commit/d3c4ca49da19f611d346f1f0379a9657f66614e6))
* **deps:** upgrade linting utils ([5233418](https://github.com/Lutonite/heig-ddc-discord-bot/commit/52334184f54ac4daaa36f7daa2c788f7af606809))
* **deps:** upgrade typescript to v4.7.4 & full package update ([dce63ce](https://github.com/Lutonite/heig-ddc-discord-bot/commit/dce63cefe0abf1e66b5a7e2a17dbf850fd46df02))
* **deps:** upgrade typescript to v4.8.4 ([4fca7e3](https://github.com/Lutonite/heig-ddc-discord-bot/commit/4fca7e3f78b6928c5c6ab6ab7885de148e4d0435))
* **pjson:** remove old dep override and upgrade engine to latest LTS ([f8b9e34](https://github.com/Lutonite/heig-ddc-discord-bot/commit/f8b9e34f1c56ba71a4dd01c47529673190c05ce2))
* prepare for firelord ([93a9d25](https://github.com/Lutonite/heig-ddc-discord-bot/commit/93a9d25b2be80d4c320df25aa63d1b6b9dea3a78))
* **scripts:** add runner with devTools inspection ([2839647](https://github.com/Lutonite/heig-ddc-discord-bot/commit/283964789265562f14790876554ca80b8a9f854b))


### Code Refactoring

* **cmd-menus:** remove deprecated usage of MessageEmbed#addField() & fix empty content issue ([fba42fb](https://github.com/Lutonite/heig-ddc-discord-bot/commit/fba42fb8f5f29a2f4f52771571a9e5722b0a8972))
* **lstnr-stream-online:** remove deprecated usage of MessageEmbed#addField() ([f0c5cfe](https://github.com/Lutonite/heig-ddc-discord-bot/commit/f0c5cfec7748c412551ce348709032fce66618f0))
* **task-canteen-menu:** remove deprecated usage of MessageEmbed#addField() & fix empty value ([b3d51f9](https://github.com/Lutonite/heig-ddc-discord-bot/commit/b3d51f90e9873d6a38d5994cd12a5a4f4c9e4ad7))
* various command fixes ([d2557ba](https://github.com/Lutonite/heig-ddc-discord-bot/commit/d2557ba0fff75539ea315a286e9b2c0a07e5b5fd))

### [1.4.1](https://github.com/Lutonite/heig-ddc-discord-bot/compare/v1.4.0...v1.4.1) (2022-09-28)


### Bug Fixes

* **firebase:** use local file for firebase configuration ([bb74212](https://github.com/Lutonite/heig-ddc-discord-bot/commit/bb74212082057a04552f52c1472747397dc771cd)), closes [#17](https://github.com/Lutonite/heig-ddc-discord-bot/issues/17)
* **noot:** add pingu to tag and lower age rating ([ff8197c](https://github.com/Lutonite/heig-ddc-discord-bot/commit/ff8197c7a5652022324ab54e0d97f3258781a7db))

## [1.4.0](https://github.com/Lutonite/heig-ddc-discord-bot/compare/v1.3.3...v1.4.0) (2022-06-14)


### Features

* **noot:** 60% chance for pingu gif ([572d360](https://github.com/Lutonite/heig-ddc-discord-bot/commit/572d3606eff15f05013a3ae56b4f0d2c4b662731))
* **noot:** add new noot command ([10ac438](https://github.com/Lutonite/heig-ddc-discord-bot/commit/10ac438b209ba0f8213fde30e627abf57cf9b814))
* **uwu:** uwuifier command ([6341072](https://github.com/Lutonite/heig-ddc-discord-bot/commit/63410727780bdc0a66b6b7539c68415e5c47e0c2))


### Bug Fixes

* **noot:** noot noot ([0aa9913](https://github.com/Lutonite/heig-ddc-discord-bot/commit/0aa9913bfe070bc1b20d585c59fbe7bb45e772dc))


### Others

* **console:** remove console logs or use logger ([e3dfd7f](https://github.com/Lutonite/heig-ddc-discord-bot/commit/e3dfd7f0eb5314cfc2c2d4c464b50f8ac95a99e8))

### [1.3.3](https://github.com/Lutonite/heig-ddc-discord-bot/compare/v1.3.2...v1.3.3) (2022-06-07)


### Bug Fixes

* **stream:** empty string as game title ([96c3e4f](https://github.com/Lutonite/heig-ddc-discord-bot/commit/96c3e4f7df6bd209956d56b5ca130d065fffd2b0))

### [1.3.2](https://github.com/Lutonite/heig-ddc-discord-bot/compare/v1.3.1...v1.3.2) (2022-06-07)


### Bug Fixes

* **stream:** embed empty value ([1bacee3](https://github.com/Lutonite/heig-ddc-discord-bot/commit/1bacee397c14a755abf267a357d7302ecb624c9b))

### [1.3.1](https://github.com/Lutonite/heig-ddc-discord-bot/compare/v1.3.0...v1.3.1) (2022-06-07)


### Bug Fixes

* **stream:** additional user IDs, strict host check ([a716f21](https://github.com/Lutonite/heig-ddc-discord-bot/commit/a716f21cf1a6c6eb2188be84cf74802e14f879f2))

## [1.3.0](https://github.com/Lutonite/heig-ddc-discord-bot/compare/v1.2.0...v1.3.0) (2022-06-02)


### Features

* **stream:** add twitch stream start notifications ([2443cb5](https://github.com/Lutonite/heig-ddc-discord-bot/commit/2443cb5899ad2a780c3af5185f92da191750fddf)), closes [#16](https://github.com/Lutonite/heig-ddc-discord-bot/issues/16)


### Others

* **deps:** bump dependencies ([7a6a70b](https://github.com/Lutonite/heig-ddc-discord-bot/commit/7a6a70b7175710976b292b65b6df72c406413117))
* **deps:** bump dependencies ([07bfce9](https://github.com/Lutonite/heig-ddc-discord-bot/commit/07bfce9af28fb71b1fe4ae86cbd9ab2560a15190))
* **deps:** bump deps ([d18d46d](https://github.com/Lutonite/heig-ddc-discord-bot/commit/d18d46d9af9057c233ae92e7e8a2753a58c96ce9))
* **license:** fix author in license ([d2d8d96](https://github.com/Lutonite/heig-ddc-discord-bot/commit/d2d8d96c35cd114c481f0f67af71b669280a532e))
* update the readme ([b75d802](https://github.com/Lutonite/heig-ddc-discord-bot/commit/b75d802d4faeae76aba6c9b4df0b32f7359c3b69))

## [1.2.0](https://github.com/Lutonite/heig-ddc-discord-bot/compare/v1.1.0...v1.2.0) (2022-03-24)


### Features

* **cmd:rrht:** add rentsch-time command ([ec7810d](https://github.com/Lutonite/heig-ddc-discord-bot/commit/ec7810db301522489f4ff53998df9e9355809366)), closes [#13](https://github.com/Lutonite/heig-ddc-discord-bot/issues/13)


### Bug Fixes

* **cmd:beers:** add ++ and -- aliases for funsies ([7671031](https://github.com/Lutonite/heig-ddc-discord-bot/commit/7671031adf9bb9ecb3a52691a47a1c37aae368e8))
* **cmd:massimo:** drop cooldown ([c665263](https://github.com/Lutonite/heig-ddc-discord-bot/commit/c66526331db5f075d2c5d2422a755b7329304f0b)), closes [#12](https://github.com/Lutonite/heig-ddc-discord-bot/issues/12)


### Others

* **deps:** bump dependencies ([5f57c1c](https://github.com/Lutonite/heig-ddc-discord-bot/commit/5f57c1c0b40a801f6f5cfa1bd174d5f64a6238d8))

## [1.1.0](https://github.com/Lutonite/heig-ddc-discord-bot/compare/v1.0.1...v1.1.0) (2022-03-20)


### Features

* [fixes [#5](https://github.com/Lutonite/heig-ddc-discord-bot/issues/5)] collection based quote storage ([f9b9dbb](https://github.com/Lutonite/heig-ddc-discord-bot/commit/f9b9dbb6f7c1afcbd5e9fe232f8627e9c42030f3))
* [fixes [#6](https://github.com/Lutonite/heig-ddc-discord-bot/issues/6)] run-batch command ([9134275](https://github.com/Lutonite/heig-ddc-discord-bot/commit/9134275ca98d8019df786efe6cedba08eec594b6))
* rrh export ([f967e64](https://github.com/Lutonite/heig-ddc-discord-bot/commit/f967e64fa663981279db42f289654469c4612e95))


### Bug Fixes

* [fixes [#7](https://github.com/Lutonite/heig-ddc-discord-bot/issues/7)] use channel id for homework module ([c52a3cf](https://github.com/Lutonite/heig-ddc-discord-bot/commit/c52a3cfda79757f795360707057b28ca1e46a908))


### Others

* add husky hooks and commitizen for standard changelogs ([e899b40](https://github.com/Lutonite/heig-ddc-discord-bot/commit/e899b40f0eada4abe482ac4be1080aeb0d1ec85e)), closes [#11](https://github.com/Lutonite/heig-ddc-discord-bot/issues/11)
* ignore husky in docker and standard-version ([510edb3](https://github.com/Lutonite/heig-ddc-discord-bot/commit/510edb3c1484e1700d0721c16e28461faa6ec516))
