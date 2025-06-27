import { InfoCardContent } from "@/types/InfoCardContent";
import "./InfoCard.scss";

export default function InfoCard({ title, message, link }: InfoCardContent) {
  return (
    <div className="info-card">
      <h2 className="info-card-title">{title}</h2>
      {message && <p className="info-card-message">{message}</p>}
      {link && (
        <a className="info-card-link" href={link.href}>
          {link.label}
        </a>
      )}
    </div>
  );
}
