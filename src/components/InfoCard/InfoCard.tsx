import { InfoCardContent } from "@/types/InfoCardContent";
import "./InfoCard.scss";

export default function InfoCard({ title, message, links }: InfoCardContent) {
  return (
    <div className="info-card">
      <h2 className="info-card-title">{title}</h2>
      {message && <p className="info-card-message">{message}</p>}
      <div className="info-card-links">
        {links &&
          links.map(({ label, href }) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
      </div>
    </div>
  );
}
