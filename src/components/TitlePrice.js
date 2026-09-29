// The title + price block from the top of the booking panel.
// On desktop it's the head of the sticky panel; on mobile it's its own
// section that sits between the gallery and the specifications.
export default function TitlePrice({ car }) {
  const name = [car?.year, car?.name].filter(Boolean).join(" ") || car?.name || "This car";

  return (
    <div className="titlePrice">
      <span className="titlePriceBadge">{(car?.brand || "ELITE FLEET").toUpperCase()}</span>
      <p className="titlePriceName">{name}</p>
    </div>
  );
}