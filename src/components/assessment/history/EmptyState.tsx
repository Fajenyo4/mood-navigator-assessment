
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  languageLabel: string;
}

const EmptyState = ({ languageLabel }: EmptyStateProps) => {
  return (
    <div className="text-center p-4">
      <p className="mb-4 text-gray-600">
        No assessments found for {languageLabel}.
      </p>
      <Button onClick={() => window.location.href = "/"}>
        Take Assessment
      </Button>
    </div>
  );
};

export default EmptyState;
