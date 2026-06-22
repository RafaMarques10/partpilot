import type { Project } from "@/lib/types";

const STORAGE_KEY = "partpilot.projects.v1";

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProject(project: Project) {
  const projects = loadProjects();
  const index = projects.findIndex((item) => item.id === project.id);
  const next =
    index >= 0 ? projects.with(index, project) : [project, ...projects];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function createProjectId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `project-${Date.now()}`;
}
