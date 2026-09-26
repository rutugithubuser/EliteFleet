/**
 * Heading text that slides up from behind an invisible edge when its section
 * scrolls into view. Use it inside a heading that sits inside a <Reveal>.
 *
 * <h2><MaskText lines="Ready to Drive?" /></h2>
 * <h2><MaskText lines={["More Than a", "Rental."]} /></h2>   one line each
 *
 * The animation lives in globals.css (.mask-line rules).
 */
export default function MaskText({ lines }) {
  const list = Array.isArray(lines) ? lines : [lines];
  return list.map((line, i) => (
    <span className="mask-line" style={{ "--line": i }} key={i}>
      <span>{line}</span>
    </span>
  ));
}
