import Link from "next/link";
import { useTranslations } from "next-intl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import type { Project } from "@/types";
import StatusBadge from "./StatusBadge";
import DeployButton from "./DeployButton";
import styles from "./ProjectCard.module.scss";

function relativeTime(
  iso: string | null,
  t: (key: string, values: { n: number }) => string,
): string | null {
  if (!iso) return null;
  const date = new Date(iso.replace(" ", "T") + "Z");
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return t("secondsAgo", { n: seconds });
  if (seconds < 3600) return t("minutesAgo", { n: Math.floor(seconds / 60) });
  if (seconds < 86400) {
    return t("hoursAgo", { n: Math.floor(seconds / 3600) });
  }
  return t("daysAgo", { n: Math.floor(seconds / 86400) });
}

export default function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations("projectCard");
  const lastRunTime =
    relativeTime(project.last_run_finished_at, t) ??
    relativeTime(project.last_run_started_at, t);

  return (
    <Card variant="outlined" data-testid="project-card">
      <CardContent>
        <div className={styles.row}>
          <div className={styles.info}>
            <div className={styles.nameRow}>
              <Typography
                component={Link}
                href={`/projects/${project.id}/runs`}
                className={styles.name}
                data-testid="project-name"
              >
                {project.name}
              </Typography>
              <StatusBadge status={project.last_run_status} />
            </div>
            <Typography
              variant="body2"
              color="text.secondary"
              className={styles.subtitle}
            >
              {project.workflow_name}
              {lastRunTime ? ` · ${t("lastRun", { time: lastRunTime })}` : ""}
            </Typography>
          </div>
          <div className={styles.deploy}>
            <DeployButton projectId={project.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
