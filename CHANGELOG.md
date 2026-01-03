## v1.0.2-alpha.24 (2026-01-03)


### ✨ Features

* Enhance changelog and release CLI configuration with customizable commit type display names and tag prefix options ([a6e23ef](https://github.com/JoeWrights/release-cli/commit/a6e23efe981e66525c877fc607969c6d3740433d))
* Enhance changelog generation by adding support for custom commit type mappings and sorting order ([5c42024](https://github.com/JoeWrights/release-cli/commit/5c420242561d0480a76750a6db881740feecfc08))
* Expand commit type options and enhance ReleaseType and PreReleaseType enums with additional categories and descriptions ([c67ecfd](https://github.com/JoeWrights/release-cli/commit/c67ecfd1ef52a73478f5b0941e5e967498baeb7c))
* Integrate conventional-changelog-angular for enhanced changelog generation and add repository metadata to package.json ([7c3075f](https://github.com/JoeWrights/release-cli/commit/7c3075f2b2940c1f2a37f215e17a89d7f671b99e))


### ♻️ Code Refactoring

* Introduce CommitType enum and COMMIT_TYPES_DISPLAY_NAME for improved commit type handling in changelog generation ([3f16e0b](https://github.com/JoeWrights/release-cli/commit/3f16e0b4a89057538d0f2c92970817bd6b8795c8))
* Update changelog generation to use CommitType enum for type display names and define a comprehensive sorting order for commit types ([a8f3c36](https://github.com/JoeWrights/release-cli/commit/a8f3c36b11d4d14dafdc3bcabe6fafbc17ad3d31))


### 📝 Documentation

* correct minor typo in README description of CLI tool ([4c39669](https://github.com/JoeWrights/release-cli/commit/4c396692fca080a5fa7b0abef262ae9fc825f4e3))
* update README to include additional features of the CLI tool ([016275b](https://github.com/JoeWrights/release-cli/commit/016275b2e7395049f29827230cda68b092edc15e))


### 🔧 Chores

* add .npmrc for ESLint and Prettier hoisting, update changelog generation options for compatibility ([3ec49c7](https://github.com/JoeWrights/release-cli/commit/3ec49c743655e2a0d3b913ca443aea32788786bb))
* Add .npmrc to hoist ESLint and Prettier dependencies for proper plugin resolution ([0f2339b](https://github.com/JoeWrights/release-cli/commit/0f2339b3cb071505a0944c0b2abfd432156436fd))
* add conventional-changelog-angular dependency for improved changelog generation ([56ee2ff](https://github.com/JoeWrights/release-cli/commit/56ee2ff0fc7360f9edeed9876dc1b42fec8fd9e1))
* bump version to 1.0.2-alpha.19 and update changelog generation comment for clarity ([31e1761](https://github.com/JoeWrights/release-cli/commit/31e17619f47d5277082733d19e8a9b0b1679a7c2))
* bump version to 1.0.2-alpha.3 and remove outdated changelog entry ([bd33642](https://github.com/JoeWrights/release-cli/commit/bd336423a030ee128e649e217211ff17cec198f8))
* bump version to 1.0.2-alpha.4 and refine changelog transformation logic ([31341a5](https://github.com/JoeWrights/release-cli/commit/31341a5c4207be1ba3d14b91e5d57de0400e3da7))
* bump version to 1.0.2-alpha.5 and comment out changelog sorting options ([281b76a](https://github.com/JoeWrights/release-cli/commit/281b76a4a51ab145addd08d53413269050f9d8a4))
* bump version to 1.0.2-alpha.6 and update changelog configuration comments ([205df9c](https://github.com/JoeWrights/release-cli/commit/205df9c09220ffbb916f986d6a2486403da66851))
* bump version to 1.0.2-alpha.7 and comment out changelog transformation logic ([cd9bbc3](https://github.com/JoeWrights/release-cli/commit/cd9bbc301806092fca4c9205b4b29d9e4a095460))
* bump version to 1.0.2-alpha.9 and enhance changelog transformation logic with custom commit type mapping and sorting ([5086d51](https://github.com/JoeWrights/release-cli/commit/5086d514b0075ad8f04cab777cc2c41f8688a66d))
* comment out changelog transformation logic for commit types ([e30433b](https://github.com/JoeWrights/release-cli/commit/e30433bc46d1ece26028bc214adb41436332d206))
* downgrade conventional-changelog dependency and update changelog generation preset to use angular format ([d64a8f0](https://github.com/JoeWrights/release-cli/commit/d64a8f0e6505d23accba61123c4f8bcf24d1b71c))
* enhance changelog transformation logic to improve commit processing and type handling ([b4b70a6](https://github.com/JoeWrights/release-cli/commit/b4b70a62b7ec5db2e8df57360dcff783dd35ce63))
* enhance changelog transformation logic to include detailed commit processing and maintain type mapping ([ef34935](https://github.com/JoeWrights/release-cli/commit/ef34935e13b620747f0b5bdcac7882c9bf89bcce))
* fix changelog generation by correcting pipe closure syntax ([a5ca2ae](https://github.com/JoeWrights/release-cli/commit/a5ca2ae1e091e8b65f80f6486ac5e130ff090333))
* integrate angular preset for enhanced changelog generation and improve commit type handling ([232c71d](https://github.com/JoeWrights/release-cli/commit/232c71d502a18db8f14ec28a52feb05283ce5afe))
* refine changelog transformation logic to restore commit type mapping and maintain console logging for debugging ([222f3ff](https://github.com/JoeWrights/release-cli/commit/222f3ffacf0a398a87345b2c397ff826cdeeaf79))
* remove changelog sorting configuration and related options ([ef14b4f](https://github.com/JoeWrights/release-cli/commit/ef14b4f41ace7aa5f05be5d752de7ec10ae86425))
* remove CHANGELOG.md as it is no longer needed ([a8cf938](https://github.com/JoeWrights/release-cli/commit/a8cf93807a19a5b846c0afeb0ca03a332342ee5e))
* Remove unused dependencies from pnpm-lock.yaml to streamline project and reduce bloat. ([685ec10](https://github.com/JoeWrights/release-cli/commit/685ec106609c8f7a63a0f565db6fc309eac9425e))
* Update build scripts to use pnpm, adjust ESLint ignore patterns, and streamline package.json for improved dependency management ([25687f2](https://github.com/JoeWrights/release-cli/commit/25687f27a92cb9f9c6b893fcc21a369f40be88f2))
* update changelog transformation logic to include console logging for debugging ([469b136](https://github.com/JoeWrights/release-cli/commit/469b136ceac062f8db509b3904d10d18ea7c0d38))
* update dependencies for changelog generation and adjust preset loading logic ([135d889](https://github.com/JoeWrights/release-cli/commit/135d889f76d7c8d3cc37c6b813ddc5048076234f))
* update package.json and improve changelog generation options ([9997354](https://github.com/JoeWrights/release-cli/commit/999735459a22308f2e5294af55561387fdb0f000))
* v1.0.0 changelog [ci skip] ([e87daf1](https://github.com/JoeWrights/release-cli/commit/e87daf1474fbe12ecfdf349c62b8c159e3863960))
* v1.0.1 changelog [ci skip] ([ce6eb72](https://github.com/JoeWrights/release-cli/commit/ce6eb72e3fe3bd4267a98f9438e0361eb74a1a27))
* v1.0.2-alpha.0 changelog [ci skip] ([5328162](https://github.com/JoeWrights/release-cli/commit/5328162742cc01257a334fc220c09cddcb372605))
* v1.0.2-alpha.1 changelog [ci skip] ([22f2b61](https://github.com/JoeWrights/release-cli/commit/22f2b6173785dc48209e6fdff0a489fb882c578e))
* v1.0.2-alpha.10 changelog [ci skip] ([e747c1f](https://github.com/JoeWrights/release-cli/commit/e747c1f645864c6af739e965661f7ce9eedac1d7))
* v1.0.2-alpha.11 changelog [ci skip] ([a366c3c](https://github.com/JoeWrights/release-cli/commit/a366c3cede8936b2d7319aedf903766580a0684f))
* v1.0.2-alpha.12 changelog [ci skip] ([f3da50f](https://github.com/JoeWrights/release-cli/commit/f3da50f4808fdcdf704190eb16a9e16ba21e6e52))
* v1.0.2-alpha.13 changelog [ci skip] ([6f24835](https://github.com/JoeWrights/release-cli/commit/6f24835b4419d6278f1a12cdac14a17a0bf7f758))
* v1.0.2-alpha.14 changelog [ci skip] ([c2aaee0](https://github.com/JoeWrights/release-cli/commit/c2aaee0b1880915905836badf98c3bb234f14fc4))
* v1.0.2-alpha.15 changelog [ci skip] ([e96fd79](https://github.com/JoeWrights/release-cli/commit/e96fd79701383f9f18933ebaf5bc777791a22cb0))
* v1.0.2-alpha.16 changelog [ci skip] ([5b7f360](https://github.com/JoeWrights/release-cli/commit/5b7f3608ef53ba5d384aaf3e8ffede088eb58db7))
* v1.0.2-alpha.16 changelog [ci skip] ([e085f23](https://github.com/JoeWrights/release-cli/commit/e085f231da4b588aabd1c91110f082606e565745))
* v1.0.2-alpha.17 changelog [ci skip] ([8b4f3ba](https://github.com/JoeWrights/release-cli/commit/8b4f3bab821b33d3f91458be59037f9fc468b70e))
* v1.0.2-alpha.18 changelog [ci skip] ([bf72a0a](https://github.com/JoeWrights/release-cli/commit/bf72a0a00a2597ea48b27da794d8ff60d1c286a6))
* v1.0.2-alpha.2 changelog [ci skip] ([b0abab2](https://github.com/JoeWrights/release-cli/commit/b0abab263a9f43e5596442016af8f9156423f343))
* v1.0.2-alpha.20 changelog [ci skip] ([fe6558c](https://github.com/JoeWrights/release-cli/commit/fe6558c058526604181168eff14ee65018e32f76))
* v1.0.2-alpha.21 changelog [ci skip] ([2ccf71d](https://github.com/JoeWrights/release-cli/commit/2ccf71d5ae61b0eb7918fad4b70ed7aefa1b9385))
* v1.0.2-alpha.22 changelog [ci skip] ([cb7609c](https://github.com/JoeWrights/release-cli/commit/cb7609cbb16da9448cf0e571b1859c8c4c0236a9))
* v1.0.2-alpha.23 changelog [ci skip] ([8e8bb56](https://github.com/JoeWrights/release-cli/commit/8e8bb568274a1c4c7d9c247708ae77be47cc7481))
* v1.0.2-alpha.8 changelog [ci skip] ([b2388f6](https://github.com/JoeWrights/release-cli/commit/b2388f6cfbba6ee355f0aa7492a862f680357a94))


### Debug

* add console logging for commit group sorting in changelog generation ([5948b2f](https://github.com/JoeWrights/release-cli/commit/5948b2f13b6642f57f6a6499a27f6e1c18e521d3))
* add console logging for commit group titles during changelog generation ([589bc3a](https://github.com/JoeWrights/release-cli/commit/589bc3a5ad8800da07e5bbb9ae0d9be0c31f606a))



