"use client";

import { FormField, formInputClass } from "./FormField";
import { ModalFooter } from "./ModalFooter";
import { useCreateProjectForm } from "@/hooks/useCreateProjectForm";
import type { Project } from "@/types";

export default function NewProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (project: Project) => void;
}) {
  const form = useCreateProjectForm(onCreated);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900">
        <h2 className="text-lg font-semibold">New Project</h2>
        <form onSubmit={form.submit} className="mt-4 flex flex-col gap-3">
          <FormField label="Name">
            <input
              required
              value={form.name}
              onChange={(e) => form.setName(e.target.value)}
              className={formInputClass}
            />
          </FormField>
          <FormField label="Slug (used in the webhook URL)">
            <input
              required
              value={form.slug}
              onChange={(e) => form.setSlug(e.target.value)}
              placeholder="my-app"
              className={formInputClass}
            />
          </FormField>
          <FormField label="Repo URL">
            <input
              value={form.repoUrl}
              onChange={(e) => form.setRepoUrl(e.target.value)}
              placeholder="github.com/you/my-app"
              className={formInputClass}
            />
          </FormField>
          <FormField label="Workflow">
            <select
              value={form.workflowId ?? ""}
              onChange={(e) => form.setWorkflowId(Number(e.target.value))}
              className={formInputClass}
            >
              {form.workflows.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </FormField>

          {form.error && <p className="text-sm text-red-600">{form.error}</p>}

          <ModalFooter onCancel={onClose} submitting={form.submitting} />
        </form>
      </div>
    </div>
  );
}
