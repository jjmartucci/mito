/*
 * Here are some things you can modify. If you make a change here while the dev
 * server is running, be sure to restart the dev server to see the changes apply
 */

module.exports = {
  postsPerPage: 5,
  siteTitle: "My new site",

  /*
   * Pick a CSS theme. The default is "mito".
   * - mito
   * - nord
   */
  theme: "mito",

  /*
   * If your post has post-date in the frontmatter, it'll will be formatted
   * like this on the individual post page. Any valid moment formats will work.
   * https://momentjs.com/docs/#/displaying/
   */
  postDateFormat: "MMM Do, YYYY",

  // these are the default site metatags
  meta: {
    title: "My new site",
    description: "It's a good site",
    author: "Me, myself, and I"
  }
};
