import React from "react";
import "../App.css";
import { Layout } from "antd";
import i18n from "../translations/i18n.js";
import { DownOutlined, GlobalOutlined } from "@ant-design/icons";
import { Dropdown, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
const { Header } = Layout;

const Headbar = () => {
  const { t, i18n } = useTranslation();
  const items = [
    {
      key: "en",
      label: t("EN"),
    },
    {
      key: "zh",
      label: t("ZH"),
    },
    {
      key: "jp",
      label: t("JP"),
    },
  ];

  const onClick = ({ key }) => {
    switch (key) {
      case "en":
        i18n.changeLanguage("en");
        break;
      case "zh":
        i18n.changeLanguage("zh");
        break;
      case "jp":
        i18n.changeLanguage("jp");
    }
  };

  return (
    <Header className={"header"}>
      <div className={"dropdown"}>
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: ["1"],
            onClick,
          }}
        >
          <Typography.Link>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <GlobalOutlined />
                {t("Language")}
                <DownOutlined />
              </Space>
            </a>
          </Typography.Link>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Headbar;
