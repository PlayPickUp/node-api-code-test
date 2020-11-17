# pickup-node-api

![Build](https://github.com/PlayPickUp/pickup-node-api/workflows/Build/badge.svg?branch=master)

## Props

### GET `/api/v1/props`

`getProps()` retrieves most recent 75 props

## Params: `limit` (default 75), `offset` (default 0), `id` (default null)

```sh
# Default - 75 props, no offset
/api/v1/props

# 10 props, with offset of 10
/api/v1/props?limit=10&offset=10

# Single Prop (id: 2006)
/api/v1/props?id=2006
```
