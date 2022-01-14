const Koa = require("koa");
const koaStatic = require("koa-static");
const child = require("child_process");

const app = new Koa();

app.use(koaStatic("./build"));

app.listen(1111, () => {
  console.log("http://localhost:1111");
  child.exec("start http://localhost:1111");
});
