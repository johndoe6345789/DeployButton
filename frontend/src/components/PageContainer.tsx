import styles from "./PageContainer.module.scss";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.container}>{children}</div>;
}
