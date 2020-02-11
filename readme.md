# mito

mito is a super, super, super simple static site generator.

## why

I built my website with Gatsby and a headless CMS and overtime got tired of updating it. All I wanted was to take a folder full of markdown files, and turn it into a website. That's it! Maybe throw some styles on top. I didn't want to think about layout files, or a headless CMS, or GraphQL, or install 900 plugins through npm. One folder, full of Markdown.

## what you get

- A tumblr style index with five posts on it, and next / prev buttons to page through posts beyond the first five.
- Single pages for each markdown post that matches the structure of the Markdown files in the `content` folder.
- Some basic styling, with css variables to override.
- A local dev server if you need it.

## get started

You can deploy and edit a new site entirely through Github.

1. Click this button => [![deploy to netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jjmartucci/mito)
2. Follow the steps in Netlify to create a clone of this repo on your Github account. Netlify will publish the site for you and give you a URL.
3. In the `/content` folder of this repo, add a new Markdown file with some content, or change an existing one.
4. Commit it. Netlify will take care of the rest and your site will update.

## run a dev server

1. Clone this repo to your machine.
2. `npm install`
3. `npm start`

Any changes you make inside of `/content` will appear in your browsers automatically.

## details

If you open any of the Markdown files inside of `content` you'll see that _most_ of the files have this at the top:

```
---
title: An example title
post-date: 02-20-2020
---
```

This is YAML front matter. `post-date` is in `YYYY-MM-DD` format, and it's used to determine the order of the posts in the main listing of posts. If you don't include the post-date the build step will attempt to use the file update date, which implies that you can be lazy and omit it unless you want more granular control over the order in which multiple posts on the same day appear.

Title is what appears above the post content in the listing, or on the actual post page. It is also optional.

## what's coming

- RSS feed
- basic config file
- image optimization
