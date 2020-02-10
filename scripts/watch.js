/**
 *
 */

const watch = require("node-watch");
const path = require("path");
const browserSync = require("browser-sync");

try {
  require("child_process").fork(
    path.join(process.cwd(), "scripts", "build.js")
  );
} catch (err) {
  console.log(err);
}

browserSync({
  files: path.join(process.cwd(), "dist"),
  server: {
    baseDir: path.join(process.cwd(), "dist"),
    index: "index.html",
    serveStaticOptions: {
      extensions: ["html"]
    }
  }
});

const onFileChange = (evt, name) => {
  console.log("%s changed.", name);
  try {
    require("child_process").fork(
      path.join(process.cwd(), "scripts", "build.js")
    );
  } catch (err) {
    console.log(err);
  }
};
watch(path.join(process.cwd(), "content"), { recursive: true }, onFileChange);
watch(path.join(process.cwd(), "static"), { recursive: true }, onFileChange);
watch(path.join(process.cwd(), "templates"), { recursive: true }, onFileChange);
