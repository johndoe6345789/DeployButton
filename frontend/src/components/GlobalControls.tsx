"use client";

import LanguageSwitcher from "./LanguageSwitcher";
import ColorModeToggle from "./ColorModeToggle";
import styles from "./GlobalControls.module.scss";

export default function GlobalControls() {
  return (
    <div className={styles.controls}>
      <LanguageSwitcher />
      <ColorModeToggle />
    </div>
  );
}
