interface BadgeProps {
  variant: "success" | "danger" | "warning" | "gold";
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  success: "badge-success",
  danger: "badge-danger",
  warning: "badge-warning",
  gold: "badge-gold",
};

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`badge ${variantClasses[variant] ?? variantClasses.success}`}>
      {children}
    </span>
  );
}
