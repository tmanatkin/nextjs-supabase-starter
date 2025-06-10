import type { Metadata } from "next";
import "../scss/global.scss";

export const metadata: Metadata = {
  title: "title",
  description: "description"
};

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
