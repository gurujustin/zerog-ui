# Zero-G Finance Frontend

## Development

You will be utilizing Wrangler for local development to emulate the Cloudflare
runtime. This is already wired up in your package.json as the `dev` script:

```sh
# start the remix dev server and wrangler
npm run dev
```

Open up [http://127.0.0.1:8788](http://127.0.0.1:8788) and you should be ready
to go!

## Deployment

Cloudflare Pages are currently only deployable through their Git provider
integrations.

If you don't already have an account, then
[create a Cloudflare account here](https://dash.cloudflare.com/sign-up/pages)
and after verifying your email address with Cloudflare, go to your dashboard and
follow the
[Cloudflare Pages deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything).

Configure the "Build command" should be set to `npm run build`, and the "Build
output directory" should be set to `public`.

## TODO

- USD amounts in swap component

- Add balance to token chooser
- Dashboard components
- Stats: Tooltips
- Landing page
- Mobile views
- Dapp Footer?
