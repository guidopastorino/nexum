"use client"

import { useState } from "react";

interface TabsProps {
  initialTab?: number; // The main tab, optional
}

export default function useTabs({ initialTab = 1 }: TabsProps = {}) {
  const [tab, setTab] = useState<number>(initialTab);

  const changeTab = (tab: number) => {
    setTab(tab);
  };

  return {
    tab,
    changeTab,
  };
}
