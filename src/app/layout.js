import "./globals.css";

export const metadata = {
  title: "Elite Fleet — Luxury & Premium Car Rental in Dubai",
  description:
    "Drive Dubai your way. Premium and luxury cars delivered across Dubai. Choose your car and make every journey exceptional.",
};

// Picks light or night mode before the page is drawn, so there's no white flash.
// Uses the visitor's saved choice if they picked one, otherwise their device setting.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the script above changes data-theme before React loads, which is expected
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
