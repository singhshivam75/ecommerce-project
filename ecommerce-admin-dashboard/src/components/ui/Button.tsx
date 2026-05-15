export default function Button({
  children,
  className = "",
  ...props
}: any) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center
        bg-primary text-white
        hover:opacity-90
        px-4 py-2 rounded-md
        text-sm font-medium
        transition
        ${className}
      `}
    >
      {children}
    </button>
  );
}