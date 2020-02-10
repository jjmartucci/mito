const ejs = require("ejs");
const path = require("path");
const fs = require("fs-extra");
const params = require(path.join(process.cwd(), "config.js"));
const MarkdownIt = require("markdown-it");
const glob = require("glob");
const matter = require("gray-matter");
const moment = require("moment");

const contentFolder = path.join(process.cwd(), "content");
const layoutTemplate = path.join(process.cwd(), "templates", "layout.ejs");
const listTemplate = path.join(process.cwd(), "templates", "list.ejs");
const postTemplate = path.join(process.cwd(), "templates", "post.ejs");
const staticFolder = path.join(process.cwd(), "static");
const dist = path.resolve(process.cwd() + "/dist");
let CONTENT;

const renderEJS = (template, params) => {
  let html;
  ejs.renderFile(
    template,
    { ...params },
    { rmWhitespace: true },
    (err, str) => {
      if (err) console.log(err);
      html = str;
    }
  );
  return html;
};

const writeEJSToFile = (template, params, outputFilePath) => {
  ejs.renderFile(
    template,
    { ...params },
    { rmWhitespace: true },
    (err, str) => {
      if (err) console.log(err);

      fs.outputFile(path.resolve(outputFilePath), str, err => {
        if (err) {
          console.log(err);
        }
        console.log(`Wrote: ${outputFilePath}`);
      });
    }
  );
};

const getContent = contentFolder => {
  const contentFound = glob.sync(`${contentFolder}/**/*.md`);
  if (contentFound.length === 0) {
    console.log(`Didn't find any content in ${contentFolder}?`);
  }
  return contentFound;
};

/**
 *
 * @param {array} content
 * @param {string} sortType
 */
const sortContent = (content, sortType = "postDate") => {
  let sort;
  if (sortType === "creationTime") {
    sort = (a, b) => {
      const statsA = fs.statSync(a);
      const statsB = fs.statSync(b);
      if (statsA.birthtimeMs > statsB.birthtimeMs) {
        return -1;
      }
      if (statsA.birthtimeMs < statsB.birthtimeMs) {
        return 1;
      }
      return 0;
    };
  }

  if (sortType === "postDate") {
    const postDateOrCreationTime = (frontMatter, file) => {
      if (frontMatter["post-date"]) {
        return moment(frontMatter["post-date"]);
      } else {
        return moment(fs.statSync(file).birthtimeMS);
      }
    };
    sort = (a, b) => {
      const fmA = getMarkdownContent(a).frontMatter;
      const fmB = getMarkdownContent(b).frontMatter;
      const aPostDate = postDateOrCreationTime(fmA, a);
      const bPostDate = postDateOrCreationTime(fmB, b);

      return bPostDate.diff(aPostDate);
    };
  }

  return content.sort(sort);
};

const getMarkdownContent = filePath => {
  const md = new MarkdownIt();
  const data = fs.readFileSync(path.resolve(filePath), "utf8");
  const fileContents = matter(data);
  const htmlFromMarkdown = md.render(fileContents.content);
  return {
    html: htmlFromMarkdown,
    frontMatter: fileContents.data
  };
};

const getPathToFile = file => {
  const fileName = file.split("/").pop();
  const relativeToContentRoot = file
    .replace(contentFolder, "")
    .replace(`/${fileName}`, "");
  const distFileName = file
    .split("/")
    .pop()
    .replace(".md", ".html");

  return `${relativeToContentRoot}/${distFileName}`;
};

const buildPostPages = () => {
  CONTENT.forEach((file, index) => {
    const outputFile = `${dist}${getPathToFile(file)}`;
    const markdownContent = getMarkdownContent(file);
    const postHTML = renderEJS(postTemplate, { ...params, ...markdownContent });

    const meta = {
      title: `${params.meta.title}${
        markdownContent.frontMatter.title
          ? ` | ${markdownContent.frontMatter.title}`
          : ""
      }`
    };
    return writeEJSToFile(
      layoutTemplate,
      { ...params, meta, content: postHTML },
      outputFile
    );
  });
};

const buildListingPages = () => {
  const totalPages = Math.ceil(CONTENT.length / params.postsPerPage);
  let currentPage = 1;
  let itemsOnPage = 1;
  let contentForPage = [];

  CONTENT.forEach((file, index) => {
    const markdownContent = getMarkdownContent(file);
    contentForPage.push({ ...markdownContent, url: getPathToFile(file) });

    if (itemsOnPage === params.postsPerPage || index === CONTENT.length - 1) {
      const listHTML = renderEJS(listTemplate, {
        ...params,
        posts: contentForPage,
        currentPage,
        totalPages
      });

      writeEJSToFile(
        layoutTemplate,
        {
          ...params,
          content: listHTML
        },
        `${dist}${
          currentPage === 1 ? "/index.html" : `/page-${currentPage}.html`
        }`
      );
      currentPage = currentPage + 1;
      itemsOnPage = 1;
      contentForPage = [];
    } else {
      itemsOnPage = itemsOnPage + 1;
    }
  });
};

const init = async () => {
  await fs.emptyDir(dist);
  console.log("removed files in dist");
  await fs.copy(staticFolder, dist);
  console.log("copied the static files");
  buildPostPages();
  buildListingPages();
};

CONTENT = getContent(contentFolder);
sortContent(CONTENT);
init();
