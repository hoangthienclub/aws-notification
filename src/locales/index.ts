import * as vi from "./vi.json";
import * as en from "./en.json";
import * as zh from "./zh.json";

export const getMessages = (code: string) => {
  switch (code) {
    case "vi-VN":
      return vi;
    case "zh-CN":
      return zh;
    default:
      return en;
  }
};
