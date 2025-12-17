import { InfoCardContent } from "@/types/InfoCardContent";
import InfoCard from "../../../components/InfoCard/InfoCard";

const infoCardContent: Record<string, InfoCardContent> = {
  "verify-email": {
    title: "Check Your Email",
    message: "A confirmation link has been sent to your inbox.",
    links: [{ label: "Log In", href: "/auth/login" }],
  },
  "update-password-auth-missing": {
    title: "Link Expired or Unauthorized",
    message: "Account recovery link is expired or user is not logged in.",
    links: [
      { label: "Forgot Password?", href: "/auth/account-recovery" },
      { label: "Log In", href: "/auth/login" },
    ],
  },
};

export default async function InfoSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = infoCardContent[slug] || {
    title: "Unknown Info Page",
    message: "This page does not exist.",
    links: [{ label: "Home", href: "/" }],
  };

  return <InfoCard {...content} />;
}
