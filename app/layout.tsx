import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "MedCareer",
  description: "Medical Job Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        {/* ✅ NAVBAR WILL SHOW ON ALL PAGES */}
        <Navbar />

        {/* PAGE CONTENT */}
        {children}

      </body>
    </html>
  );
}
