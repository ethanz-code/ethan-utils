import chalk from "chalk";
import cowsay from "cowsay";

console.log(
  chalk.bgYellowBright.white("欢迎使用 Ethan Zhang 的 Vue, NodeJS 开发工具包"),
);
console.log(chalk.bgBlueBright.white.bold("联系方式：hi@itcox.cn"));

console.log(
  chalk.yellow(
    cowsay.say({
      text: "本工具包助你高效开发！🚂🚂🚂",
      e: "^^",
      T: "U ",
    }),
  ),
);
