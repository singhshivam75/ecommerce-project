export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        bg-surface1/80 dark:bg-surface1/80
        backdrop-blur-md
        border border-border
        rounded-2xl
        shadow-token hover:shadow-xl
        hover:-translate-y-1
        transition-all duration-300
        p-5
        ${className}
      `}
    >
      {children}
    </div>
  );
}