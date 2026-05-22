export const Avatar = ({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md";
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    "bg-primary-100 text-primary-700",
    "bg-secondary-100 text-secondary-700",
    "bg-info-light text-info-dark",
    "bg-accent-100 text-accent-700",
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div
      className={`
          ${size === "sm" ? "w-7 h-7 text-2xs" : "w-9 h-9 text-xs"}
          ${colors[colorIndex]}
          rounded-full flex items-center justify-center font-semibold font-display flex-shrink-0
        `}
    >
      {initials}
    </div>
  );
};
