/** Shape of `projects.items` from i18n (subset used in UI). */
export type ArchitectureDecisions = {
  design?: string;
  database?: string;
  scalability?: string;
  tradeoffs?: string;
};

export type ProjectItem = {
  title: string;
  emoji?: string;
  type?: string;
  description?: string;
  solution?: string;
  problem?: string;
  highlights?: string[];
  technologies?: string[];
  link?: string;
  linkLabel?: string;
  githubLink?: string;
  architectureDecisions?: ArchitectureDecisions;
};
