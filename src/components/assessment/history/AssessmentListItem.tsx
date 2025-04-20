
import { Button } from "@/components/ui/button";
import { AssessmentRecord } from '@/utils/scoring/types';

interface AssessmentListItemProps {
  assessment: AssessmentRecord;
  onView: (assessment: AssessmentRecord) => void;
  getLanguageLabel: (code: string) => string;
}

const AssessmentListItem = ({ assessment, onView, getLanguageLabel }: AssessmentListItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-lg">{assessment.final_mood}</h3>
          <p className="text-sm text-gray-500">
            {formatDate(assessment.created_at)} - {getLanguageLabel(assessment.language_code || 'en')}
          </p>
          {assessment.mental_status && (
            <p className="text-sm text-blue-600 mt-1">
              Mental Status: {assessment.mental_status}
            </p>
          )}
        </div>
        <Button 
          onClick={() => onView(assessment)}
          variant="outline"
        >
          View Results
        </Button>
      </div>
    </div>
  );
};

export default AssessmentListItem;
