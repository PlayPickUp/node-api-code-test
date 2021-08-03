# [0.22.0](https://github.com/PlayPickUp/pickup-node-api/compare/v0.21.0...v0.22.0) (2021-08-03)


### Bug Fixes

* **marketplace:** updated fan variables to accept name change in profile ([#150](https://github.com/PlayPickUp/pickup-node-api/issues/150)) ([19988ac](https://github.com/PlayPickUp/pickup-node-api/commit/19988acb3d61d8e2c8834f96418ed0b85ca6556a))


### Features

* **Home Base:** Reorder Labels[#962](https://github.com/PlayPickUp/pickup-node-api/issues/962) ([#160](https://github.com/PlayPickUp/pickup-node-api/issues/160)) ([e9c44d8](https://github.com/PlayPickUp/pickup-node-api/commit/e9c44d8b483fa2a50d510463fc6cd28027c0f494))
* **marketplace:** added conditional for prize code length ([#161](https://github.com/PlayPickUp/pickup-node-api/issues/161)) ([55460b6](https://github.com/PlayPickUp/pickup-node-api/commit/55460b682e2f77493c935fbad4922c14b59cc263))
* **marketplace:** condensed calls to db in redemption dates ([#159](https://github.com/PlayPickUp/pickup-node-api/issues/159)) ([e2fb914](https://github.com/PlayPickUp/pickup-node-api/commit/e2fb9148c2b0be3a2e577f00dd8928534c5155bc))
* **marketplace:** refactored prizes endpoint to handle all logic ([#166](https://github.com/PlayPickUp/pickup-node-api/issues/166)) ([0bdf272](https://github.com/PlayPickUp/pickup-node-api/commit/0bdf27279d7e5ff423005e36aac331d65c478aa2))
* **marketplace:** updated redemption logic to post new code to prize redemptions table ([#155](https://github.com/PlayPickUp/pickup-node-api/issues/155)) ([a10def8](https://github.com/PlayPickUp/pickup-node-api/commit/a10def8694a63c3d4e7174a0c6d760e5c6dcf0e4))
* **mixpanel:** expand mixpanel for contractor ([#162](https://github.com/PlayPickUp/pickup-node-api/issues/162)) ([2f1dcbf](https://github.com/PlayPickUp/pickup-node-api/commit/2f1dcbfd3378e1f0b161568b42635812b65293ca))
* **picks-api:** Add Picks API to get and create fan picks ([#149](https://github.com/PlayPickUp/pickup-node-api/issues/149)) ([0b6c4d8](https://github.com/PlayPickUp/pickup-node-api/commit/0b6c4d8c2518ea69d898e1e2fc9799e1f8cd1bbc))
* **posts:** add ability to return posts by publisher ([#152](https://github.com/PlayPickUp/pickup-node-api/issues/152)) ([07c8831](https://github.com/PlayPickUp/pickup-node-api/commit/07c8831f6a4f3c1a497c0f065938bd5af33c5dea))
* **PropPicks:** Add pick popularities to Picks in Props responses ([#151](https://github.com/PlayPickUp/pickup-node-api/issues/151)) ([5557d53](https://github.com/PlayPickUp/pickup-node-api/commit/5557d530de6556e224524c8e768ff55da152661e))

# [0.21.0](https://github.com/PlayPickUp/pickup-node-api/compare/v0.20.1...v0.21.0) (2021-07-27)


### Bug Fixes

* **marketplace:** updated fan variables to accept name change in profile ([#150](https://github.com/PlayPickUp/pickup-node-api/issues/150)) ([5ee0c83](https://github.com/PlayPickUp/pickup-node-api/commit/5ee0c8325da0ba216159331953b643cc4e9f515b))


### Features

* **Home Base:** Reorder Labels[#962](https://github.com/PlayPickUp/pickup-node-api/issues/962) ([#160](https://github.com/PlayPickUp/pickup-node-api/issues/160)) ([734d675](https://github.com/PlayPickUp/pickup-node-api/commit/734d6755e5a178fcc854f66ba9132d5058522917))
* **marketplace:** condensed calls to db in redemption dates ([#159](https://github.com/PlayPickUp/pickup-node-api/issues/159)) ([244f617](https://github.com/PlayPickUp/pickup-node-api/commit/244f617f1fc8b10a25ca7c9ce7e2c688c2dcd9e8))
* **marketplace:** updated redemption logic to post new code to prize redemptions table ([#155](https://github.com/PlayPickUp/pickup-node-api/issues/155)) ([7fc8601](https://github.com/PlayPickUp/pickup-node-api/commit/7fc8601f006504e3729f26440c3ae0bd139b7ab2))
* **mixpanel:** expand mixpanel for contractor ([#162](https://github.com/PlayPickUp/pickup-node-api/issues/162)) ([1d0190a](https://github.com/PlayPickUp/pickup-node-api/commit/1d0190a4fe605b5e43f11c5dee08df1cabb9a077))
* **picks-api:** Add Picks API to get and create fan picks ([#149](https://github.com/PlayPickUp/pickup-node-api/issues/149)) ([f28f623](https://github.com/PlayPickUp/pickup-node-api/commit/f28f6237074931ddedadc1891845a82272fbfead))
* **posts:** add ability to return posts by publisher ([#152](https://github.com/PlayPickUp/pickup-node-api/issues/152)) ([2e6da20](https://github.com/PlayPickUp/pickup-node-api/commit/2e6da20a311249877f99c7f7f99b0cf5460f46d7))
* **PropPicks:** Add pick popularities to Picks in Props responses ([#151](https://github.com/PlayPickUp/pickup-node-api/issues/151)) ([b789333](https://github.com/PlayPickUp/pickup-node-api/commit/b789333fcfc9957b8e659f67f7a17f48895e1715))

## [0.20.1](https://github.com/PlayPickUp/pickup-node-api/compare/v0.20.0...v0.20.1) (2021-07-08)


### Bug Fixes

* **marketplace:** updated redeem function to unassign code and and not deduct points during errors ([#142](https://github.com/PlayPickUp/pickup-node-api/issues/142)) ([2d6da6f](https://github.com/PlayPickUp/pickup-node-api/commit/2d6da6fe76b229c6074628df395568f56fba73eb))

# [0.20.0](https://github.com/PlayPickUp/pickup-node-api/compare/v0.19.0...v0.20.0) (2021-07-01)


### Features

* **marketplace:**  :recycle:  update fan marketplace_pts column deduction instead of points ([#135](https://github.com/PlayPickUp/pickup-node-api/issues/135)) ([24bac59](https://github.com/PlayPickUp/pickup-node-api/commit/24bac5952fc620db91d3fc9a655a1ecff9dd872f))
* **picks-props-api:** Create Picks Endpoints, Add picks to props ([#137](https://github.com/PlayPickUp/pickup-node-api/issues/137)) ([0567d54](https://github.com/PlayPickUp/pickup-node-api/commit/0567d54786b975b4edba9025bfb3448743b4e706))

# [0.19.0](https://github.com/PlayPickUp/pickup-node-api/compare/v0.18.0...v0.19.0) (2021-06-28)

### Features

- **marketplace:** added fanatics to prizes ([#132](https://github.com/PlayPickUp/pickup-node-api/issues/132)) ([6141cea](https://github.com/PlayPickUp/pickup-node-api/commit/6141ceaddd1b39b1629dad568ebf323bf819ff63))

# [0.18.0](https://github.com/PlayPickUp/pickup-node-api/compare/v0.17.0...v0.18.0) (2021-06-22)

### Features

- **cicd:** Add semantic release workflow, closes [#69](https://github.com/PlayPickUp/pickup-node-api/issues/69) ([8267b69](https://github.com/PlayPickUp/pickup-node-api/commit/8267b6950005ed67204dd5eefc9cd068109c9abb))
- **tracking:** Add event tracking across Node API ([#116](https://github.com/PlayPickUp/pickup-node-api/issues/116)) ([648a4e9](https://github.com/PlayPickUp/pickup-node-api/commit/648a4e902b377914c0ef379ab95f7ff3298c014f))
