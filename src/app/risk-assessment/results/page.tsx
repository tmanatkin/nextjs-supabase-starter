import { Suspense } from "react";
import ResultsContent from "./ResultsContent";

export default function ResultsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ResultsContent />
      </Suspense>
    </div>
  );
}
