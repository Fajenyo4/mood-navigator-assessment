
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: {
    mood: string;
    message: string;
    redirectUrl: string;
    iconType: 'smile' | 'meh' | 'frown';
    iconColor: string;
    depressionResult?: {
      score: number;
      level: string;
      message: string;
    };
    anxietyResult?: {
      score: number;
      level: string;
      message: string;
    };
    stressResult?: {
      score: number;
      level: string;
      message: string;
    };
    satisfactionResult?: {
      score: number;
      level: string;
      message: string;
    };
    isParent?: number;
    needsHelp?: number;
  };
  onManualRedirect: () => void;
}

const ResultsDialog: React.FC<ResultsDialogProps> = ({
  open,
  onOpenChange,
  result,
  onManualRedirect,
}) => {
  const renderIcon = () => {
    const className = `w-12 h-12 ${result.iconColor}`;
    
    switch (result.iconType) {
      case 'smile':
        return <Smile className={className} />;
      case 'meh':
        return <Meh className={className} />;
      case 'frown':
        return <Frown className={className} />;
      default:
        return <Smile className={className} />;
    }
  };

  const renderMessage = () => {
    return result.message.split('\n').map((line, index) => (
      <p key={index} className="text-sm text-gray-700 mb-2">{line}</p>
    ));
  };

  // Prepare data for the chart
  const chartData = [
    {
      name: 'Depression',
      value: result.depressionResult?.score || 0,
      level: result.depressionResult?.level || '',
      color: getColorForLevel(result.depressionResult?.level || '')
    },
    {
      name: 'Anxiety',
      value: result.anxietyResult?.score || 0,
      level: result.anxietyResult?.level || '',
      color: getColorForLevel(result.anxietyResult?.level || '')
    },
    {
      name: 'Stress',
      value: result.stressResult?.score || 0,
      level: result.stressResult?.level || '',
      color: getColorForLevel(result.stressResult?.level || '')
    },
    {
      name: 'Life Satisfaction',
      value: result.satisfactionResult?.score || 0,
      level: result.satisfactionResult?.level || '',
      color: getColorForSatisfactionLevel(result.satisfactionResult?.level || '')
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Assessment Results</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="mb-2">{renderIcon()}</div>
          <div className="space-y-4 text-left w-full">
            {renderMessage()}
          </div>

          {/* Results Chart */}
          <div className="w-full h-64 mt-4">
            <ChartContainer config={{ 
              depression: { theme: { light: '#ef4444', dark: '#f87171' } },
              anxiety: { theme: { light: '#f59e0b', dark: '#fbbf24' } },
              stress: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
              satisfaction: { theme: { light: '#10b981', dark: '#34d399' } },
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="text-sm text-gray-500 text-center mt-4">
            <p>Your results have been saved. Redirecting to courses in 10 seconds...</p>
          </div>
          <Button 
            onClick={onManualRedirect} 
            className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Go to Mican Capital Courses</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions to determine colors based on levels
function getColorForLevel(level: string): string {
  switch (level.toLowerCase()) {
    case 'normal':
      return '#10b981'; // Green
    case 'mild':
      return '#fbbf24'; // Yellow
    case 'medium':
    case 'moderate':
      return '#f59e0b'; // Orange
    case 'critical':
    case 'severe':
      return '#ef4444'; // Red
    case 'very serious':
    case 'extremely severe':
      return '#7f1d1d'; // Dark red
    default:
      return '#6b7280'; // Gray
  }
}

function getColorForSatisfactionLevel(level: string): string {
  switch (level.toLowerCase()) {
    case 'very satisfied':
      return '#10b981'; // Green
    case 'satisfactory':
    case 'satisfied':
      return '#34d399'; // Light green
    case 'neutral':
      return '#fbbf24'; // Yellow
    case 'unsatisfactory':
    case 'dissatisfied':
      return '#f59e0b'; // Orange
    case 'very unsatisfactory':
    case 'very dissatisfied':
      return '#ef4444'; // Red
    default:
      return '#6b7280'; // Gray
  }
}

export default ResultsDialog;
