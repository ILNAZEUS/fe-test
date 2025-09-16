import React from "react";
import s from "./style.module.css";
import { SetState } from "../../types/global";

export interface ITab {
  label: string;
  key: string;
}

interface Props {
  list: ITab[];
  activeTab: string;
  setActiveTab: SetState<string>;
}

export const Tabs: React.FC<Props> = ({ activeTab, list, setActiveTab }) => {
  const handleChange = (key: string) => setActiveTab(key);

  return (
    <ul className={s.tabs}>
      {list.map((item) => (
        <li
          onClick={() => handleChange(item.key)}
          key={item.key}
          className={`${s.item} ${activeTab === item.key ? s.active : ""}`}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
};
