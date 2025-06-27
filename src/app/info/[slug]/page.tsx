import { InfoCardContent } from "@/types/InfoCardContent";
import InfoCard from "../../../components/InfoCard/InfoCard";

const infoCardContent: Record<string, InfoCardContent> = {
  "verify-email": {
    title: "Check Your Email",
    message: "A confirmation link has been sent to your inbox.",
    link: { label: "Log In", href: "/auth/login" }
  }
};

export default async function InfoSlugPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const content = infoCardContent[slug] || {
    title: "Unknown Info Page",
    message: "This page does not exist.",
    link: { label: "Home", href: "/" }
  };

  return <InfoCard {...content} />;
}
