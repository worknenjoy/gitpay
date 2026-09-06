# Gitpay Documentation

This repository holds the source for [docs.gitpay.me](https://docs.gitpay.me), the documentation
site for [Gitpay](https://gitpay.me) — the platform that connects sponsors, maintainers, and
contributors to fund GitHub issues, request payment for delivered work, and get paid.

The site is a static [Jekyll](https://jekyllrb.com/) site, published from this `gh-pages` branch
via GitHub Pages.

## Structure

```
_docs/          Task-oriented documentation (getting started, payments, payouts, disputes, ...)
  en/             English docs
  br/             Portuguese (Brazil) docs
_posts/         Blog posts and SEO articles (English and Portuguese)
_data/          Navigation, changelog, and translation strings
_layouts/       Page templates (home, doc, post, page, changelog, contact)
_includes/      Shared partials (header, footer, hero, navbar, ...)
_sass/          Theme styles (based on UIkit)
en/             English site pages (homepage, contact, changelog, 404)
br/             Portuguese site pages (homepage, contact, changelog, 404)
```

Content lives in two parallel language trees (`en/` and `br/` under `_docs/` and at the site root).
When you add or change an English doc, add the matching Portuguese page (or open a follow-up issue
if you can't translate it yourself) so the two languages don't drift out of sync.

## Running locally

Requires [Ruby](https://www.ruby-lang.org/) and [Bundler](https://bundler.io/).

```bash
bundle install
bundle exec jekyll serve
```

The site is served at `http://localhost:4000` by default. Rebuild after changing `_config.yml`
(Jekyll doesn't reload it automatically).

## Adding content

- **Docs** live in `_docs/en/` and `_docs/br/`, and are linked from the sidebar via
  `_data/navigation_docs.yml`. A doc that isn't listed there is still built and published, but
  won't show up in navigation — check that file when adding a new doc.
- **Posts** live in `_posts/`, named `YYYY-MM-DD-title.md`. Avoid creating near-duplicate posts
  that only swap a keyword or audience name — prefer expanding one comprehensive article over
  publishing several thin variations targeting the same search intent.
- **Homepage categories** are configured in `_data/navigation_home.yml`.

## Deploying

`deploy-ghpages.sh` builds the site and pushes the result to the `gh-pages` branch, which GitHub
Pages serves directly. In most setups this runs from CI; see `.circleci/config.yml`.

## Credits

Built on top of the [Docs Jekyll theme](https://jekyll.plus/) by Ivan Chromjak, since customized
for Gitpay's documentation and content.
