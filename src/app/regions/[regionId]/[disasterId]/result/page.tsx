import { Suspense } from "react";
import ResultPage from "@/app_pages/ResultPage";

export default function GameResultPage() {
  return (
    <Suspense fallback={<div>Loading result...</div>}>
      <ResultPage />
    </Suspense>
  );
}
