import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 这里添加你的语言资源
const resources = {
  en: {
    translation: {
      Language: "Language",
      History: "History",
      "Option 1": "Option 1",
      "Option 2": "Option 2",
      User: "User",
      Team: "Team",
      Files: "Files",
      input_holder: "Something here...",
      SignOut: "Sign Out",
      GoogleSignIn: "Sign in with Google",
      EN: "English",
      ZH: "Chinese",
      JP: "Japanese",
    },
  },
  zh: {
    translation: {
      Language: "语言",
      History: "历史",
      "Option 1": "选项 1",
      "Option 2": "选项 2",
      User: "用户",
      Team: "团队",
      Files: "文件",
      input_holder: "在这里输入...",
      SignOut: "登出",
      GoogleSignIn: "通过谷歌登录",
      EN: "英语",
      ZH: "中文",
      JP: "日语",
    },
  },
  jp: {
    translation: {
      Language: "言語",
      History: "歴史",
      "Option 1": "オプション 1",
      "Option 2": "オプション 2",
      User: "ユーザー",
      Team: "チーム",
      Files: "ファイル",
      input_holder: "ここに入力 ...",
      SignOut: "ログアウト",
      GoogleSignIn: "Googleでログイン录",
      EN: "英語",
      ZH: "中国語",
      JP: "日本語",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // 如果要设置默认语言
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
