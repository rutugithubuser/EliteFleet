import Image from "next/image";

export default function Logo({ className, height = 44, dark = false }) {
  return (
    <span className={className} style={{ display: "inline-flex", height, width: "auto" }}>
      <Image
        src="/images/branding/logo.png"
        alt="Elite Fleet — Car Rental"
        width={190}
        height={55}
        style={{ height: "100%", width: "auto", objectFit: "contain" }}
        loading="eager"
      />
    </span>
  );
}
