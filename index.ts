import chalk from "chalk";
import cowsay from "@ethan-utils/cowsay";
import payGateway from "@ethan-utils/pay-gateway";

console.log(
  chalk.bgYellowBright.white(
    "欢迎使用 Ethan Zhang 的 Vue, React, NodeJS 开发工具包",
  ),
);
console.log(chalk.bgBlueBright.white.bold("联系方式：hi@itcox.cn"));

console.log(chalk.yellow(cowsay()));
console.log(payGateway.helloPayGateway());
console.log(
  payGateway.ltzf.setLtzfApiConfig({
    baseURL: "xx",
    key: "xx",
    mch_id: "xx",
    notifyUrl: "xx",
    returnUrl: "xx",
  }),
);
