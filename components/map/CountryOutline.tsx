/**
 * A country's outline in ink, from public/maps/shapes, drawn through a mask so it follows the theme.
 * Tuvalu has no outline at the map's detail, so it shows as a dot, as on the map.
 */
export default function CountryOutline({
  code,
  align = "center",
  className = "",
}: {
  code: string;
  /** Where the outline sits in its box: centred, or against the left edge (the home card). */
  align?: "center" | "left";
  className?: string;
}) {
  if (code === "tv") {
    return (
      <span aria-hidden="true" className={`flex items-center ${align === "left" ? "justify-start" : "justify-center"} ${className}`}>
        <span className="size-2 rounded-full bg-foreground" />
      </span>
    );
  }
  const url = `url(/maps/shapes/${code}.svg)`;
  return (
    <span
      aria-hidden="true"
      className={`block bg-foreground ${className}`}
      style={{
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: align === "left" ? "left center" : "center",
        WebkitMaskPosition: align === "left" ? "left center" : "center",
      }}
    />
  );
}
