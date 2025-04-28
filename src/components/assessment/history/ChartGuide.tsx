
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ChartGuide = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Info className="h-4 w-4 mr-1" />
          Chart Guide
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-4">
        <Tabs defaultValue="chart">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="chart" className="w-1/2">Chart Guide</TabsTrigger>
            <TabsTrigger value="assessment" className="w-1/2">Assessment Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            <div className="space-y-2">
              <h4 className="font-semibold">How to use this chart:</h4>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>Hover over any data point to see detailed scores and classifications</li>
                <li>Use the date range filter to focus on specific time periods</li>
                <li>The colored background indicates severity levels for each metric</li>
                <li>Trend arrows show changes from your previous assessment</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="assessment">
            <div className="space-y-2">
              <h4 className="font-semibold">About the Assessment:</h4>
              <p className="text-sm">The assessment consists of 28 questions:</p>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>Questions 1-5: Life Satisfaction Scale</li>
                <li>Questions 6-26: DASS-21 Scale (Depression, Anxiety, Stress)</li>
                <li>Questions 27-28: Demographic Information</li>
              </ul>
              <p className="text-sm mt-2">All answers are confidential and used to calculate your mental health metrics.</p>
            </div>
          </TabsContent>
        </Tabs>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ChartGuide;
