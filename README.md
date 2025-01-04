# twitterist

A super simple cloudflare worker that converts awful `x.com` links to wonderful prehistoric `twitter.com` links.

## Usage

You can use the form. After conversion, clicking on the text box will automatically copy it into the clipboard.

You can also use the advanced automatic feature:

1. Go to `https://twitterist.ryanmr.workers.dev/<https://x.com/...>`
    [example](https://twitterist.ryanmr.workers.dev/https://x.com/ryanmr/status/1874334743824679005)
2. Copy the converted url as usual

## Development

```
pnpm install
pnpm run dev
```

```
pnpm run deploy
```

## Tech

- Cloudflare Workers
- zod
- hono

## FAQ

### Why is it called `twitterist`?

For no reason. It could have been called `twitter4ever` but that seems less than ideal for a subdomain later.

### Why does this exist?

If I want to share a tweet, I manually change the URL from `x.com` to `twitter.com`. One day that could break, but until then, to keep the dream alive, I could use this to partially automate the conversion. This could also be a Chrome/Firefox extension, or also integrate through a Share Sheet.

### Why does it use Cloudflare Workers?

For no reason. Could be entirely local. It would be 100% simpler if it was too.

### Why does this use hono?

Hono is a ready-to-use router for Cloudflare Workers. It provides immense quality of life compared to plain workers. If this were entirely local though, Hono would be unnecessary. 

### Did you really write this?

Robots wrote a lot of it.