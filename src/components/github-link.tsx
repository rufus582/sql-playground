import { Icon } from "#icons/huge-icon";
import { GithubIcon } from "#icons/ui";
import { Tooltip } from "#ui/custom-components/tooltip-wrapper";

const REPOSITORY_URL = "https://github.com/rufus582/sql-playground";

export function GithubLink() {
  return (
    <Tooltip content="View source on GitHub">
      <a
        href={REPOSITORY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
        className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Icon icon={GithubIcon} size={16} />
      </a>
    </Tooltip>
  );
}
