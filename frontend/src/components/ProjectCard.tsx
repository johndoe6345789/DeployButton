import Link from "next/link";
import type { Project } from "@/types";
import StatusBadge from "./StatusBadge";
import DeployButton from "./DeployButton";

function relativeTime(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso.replace(" ", "T") + "Z");
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ProjectCard({ project }: { project: Project }) {
  const lastRunTime =
    relativeTime(project.last_run_finished_at) ??
    relativeTime(project.last_run_started_at);

  return (
    <div className="flex items-center justify-between rounded-lg border border-black/10 p-4 dark:border-white/10">
      <div>
        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${project.id}/runs`}
            className="font-semibold hover:underline"
          >
            {project.name}
          </Link>
          <StatusBadge status={project.last_run_status} />
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {project.workflow_name}
          {lastRunTime ? ` · last run ${lastRunTime}` : ""}
        </p>
      </div>
      <DeployButton projectId={project.id} />
    </div>
  );
}
