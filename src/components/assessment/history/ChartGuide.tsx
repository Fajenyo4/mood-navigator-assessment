
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

const ChartGuide = () => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          Chart Guide
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">How to use this chart:</h4>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li>Hover over any data point to see detailed scores and classifications</li>
            <li>Use the date range filter to focus on specific time periods</li>
            <li>The colored background indicates severity levels for each metric</li>
            <li>Trend arrows show changes from your previous assessment</li>
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ChartGuide;
