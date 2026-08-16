import { Link } from "react-router-dom";

interface StatusAction {
  label: string;
  onClick?: () => void;
  to?: string;
}

interface FullPageStatusProps {
  title: string;
  description?: string;
  action?: StatusAction;
}

function StatusActionButton({ action }: { action: StatusAction }) {
  if (action.to) {
    return (
      <Link className="button primary" to={action.to}>
        {action.label}
      </Link>
    );
  }

  return (
    <button
      className="button primary"
      type="button"
      onClick={action.onClick}
    >
      {action.label}
    </button>
  );
}

export function FullPageStatus({
  title,
  description,
  action,
}: FullPageStatusProps) {
  return (
    <main className="status-page">
      <section className="status-card" aria-live="polite">
        <p className="auth-logo">StudyLog</p>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {action && <StatusActionButton action={action} />}
      </section>
    </main>
  );
}
