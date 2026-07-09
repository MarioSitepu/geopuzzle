import { Suspense } from "react";
import PuzzleGame from "@/app_pages/PuzzleGame";

export default function PuzzlePage() {
  return (
    <Suspense fallback={<div>Loading puzzle...</div>}>
      <PuzzleGame />
    </Suspense>
  );
}
