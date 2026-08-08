"use client";

import type { StepType } from "@/types";
import type { Config } from "./step-fields/shared";
import GitPullFields from "./step-fields/GitPullFields";
import ShellFields from "./step-fields/ShellFields";
import NpmInstallFields from "./step-fields/NpmInstallFields";
import NpmBuildFields from "./step-fields/NpmBuildFields";
import DockerBuildFields from "./step-fields/DockerBuildFields";
import HttpWebhookFields from "./step-fields/HttpWebhookFields";
import BlueGreenDeployFields from "./step-fields/BlueGreenDeployFields";
import DelayFields from "./step-fields/DelayFields";
import NotifyFields from "./step-fields/NotifyFields";

const FIELD_COMPONENTS: Record<
  StepType,
  React.ComponentType<{ config: Config; onChange: (config: Config) => void }>
> = {
  git_pull: GitPullFields,
  shell: ShellFields,
  npm_install: NpmInstallFields,
  npm_build: NpmBuildFields,
  docker_build: DockerBuildFields,
  http_webhook: HttpWebhookFields,
  blue_green_deploy: BlueGreenDeployFields,
  delay: DelayFields,
  notify: NotifyFields,
};

export default function StepConfigForm({
  type,
  config,
  onChange,
}: {
  type: StepType;
  config: Config;
  onChange: (config: Config) => void;
}) {
  const FieldsComponent = FIELD_COMPONENTS[type];
  if (!FieldsComponent) return null;
  return <FieldsComponent config={config} onChange={onChange} />;
}
