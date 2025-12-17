import { InfoCardContent } from "@/types/InfoCardContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InfoCard({ title, message, links }: InfoCardContent) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {message && <CardDescription className="text-base">{message}</CardDescription>}
        </CardHeader>
        {links && links.length > 0 && (
          <CardContent className="space-y-2">
            {links.map(({ label, href }) => (
              <Button key={label} asChild variant="outline" className="w-full">
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
