"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get("score") || "0");

  const getRiskCategory = (points: number) => {
    if (points >= 10 && points <= 18) {
      return {
        level: "Low Risk",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description:
          "Your home and auto insurance profile shows strong risk management. You're likely eligible for better rates and discounts.",
      };
    } else if (points >= 19 && points <= 29) {
      return {
        level: "Medium Risk",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        description:
          "Your profile shows moderate risk factors. There are opportunities to improve and potentially lower your insurance rates.",
      };
    } else if (points >= 30 && points <= 40) {
      return {
        level: "High Risk",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        description:
          "Your profile indicates several risk factors. Consider making improvements to reduce your insurance rates.",
      };
    }
    return {
      level: "Unknown",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      description: "Unable to determine risk level.",
    };
  };

  const riskInfo = getRiskCategory(score);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Your Risk Assessment Results</CardTitle>
          <CardDescription>Based on your responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg border-2 ${riskInfo.bgColor} ${riskInfo.borderColor}`}>
            <h2 className={`text-3xl font-bold ${riskInfo.color}`}>{riskInfo.level}</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">{riskInfo.description}</p>

            {score >= 30 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-2">Ways to Lower Your Rates:</h3>
                <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc">
                  <li>Upgrade home security system</li>
                  <li>Improve home maintenance</li>
                  <li>Take a defensive driving course</li>
                  <li>Reduce annual mileage</li>
                  <li>Park in a garage or secure location</li>
                </ul>
              </div>
            )}

            {score >= 19 && score <= 29 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Recommendations to Improve:</h3>
                <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                  <li>Consider bundling policies for better rates</li>
                  <li>Review your coverage limits</li>
                  <li>Look into available discounts</li>
                  <li>Monitor your driving record</li>
                </ul>
              </div>
            )}

            {score <= 18 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Great Job!</h3>
                <p className="text-sm text-green-800">
                  Your excellent risk profile makes you eligible for premium discounts. Shop around to ensure you're
                  getting the best rates.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={() => router.push("/")} variant="outline" className="flex-1">
              Return Home
            </Button>
            <Button onClick={() => router.push("/risk-assessment")} className="flex-1">
              Retake Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
