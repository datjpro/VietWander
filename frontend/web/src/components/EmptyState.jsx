export function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <span className="material-symbols-outlined empty-state-icon">travel_explore</span>
      <h3>{title}</h3>
      <p className="muted-copy">{description}</p>
      {action}
    </div>
  );
}
