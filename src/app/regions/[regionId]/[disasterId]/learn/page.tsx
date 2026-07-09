import { Suspense } from "react";
import LearningModule from "@/app_pages/LearningModule";

export default function LearnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LearningModule />
    </Suspense>
  );
}
