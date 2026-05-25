"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface FilterSidebarProps {
  selectedTypes: string[];
  onTypeChange: (type: string, checked: boolean) => void;
  selectedRanking: string;
  onRankingChange: (ranking: string) => void;
  onReset: () => void;
}

export function FilterSidebar({
  selectedTypes,
  onTypeChange,
  selectedRanking,
  onRankingChange,
  onReset
}: FilterSidebarProps) {
  return (
    <aside className="w-full space-y-6 md:w-64 shrink-0">
      <div>
        <h3 className="mb-4 text-sm font-medium">Filters</h3>
        <div className="space-y-6">
          
          {/* Institute Type - Checkboxes */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Institute Type
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="type-iit"
                  checked={selectedTypes.includes('IIT')}
                  onCheckedChange={(checked) => onTypeChange('IIT', checked as boolean)}
                />
                <Label 
                  htmlFor="type-iit" 
                  className="text-sm font-normal cursor-pointer"
                >
                  IIT
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="type-nit"
                  checked={selectedTypes.includes('NIT')}
                  onCheckedChange={(checked) => onTypeChange('NIT', checked as boolean)}
                />
                <Label 
                  htmlFor="type-nit" 
                  className="text-sm font-normal cursor-pointer"
                >
                  NIT
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="type-iiit"
                  checked={selectedTypes.includes('IIIT')}
                  onCheckedChange={(checked) => onTypeChange('IIIT', checked as boolean)}
                />
                <Label 
                  htmlFor="type-iiit" 
                  className="text-sm font-normal cursor-pointer"
                >
                  IIIT
                </Label>
              </div>
            </div>
          </div>

          {/* NIRF Ranking - Radio Group */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              NIRF Ranking
            </h4>
            <RadioGroup value={selectedRanking} onValueChange={onRankingChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="top5" id="rank-top5" />
                <Label 
                  htmlFor="rank-top5" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Top 5
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="top10" id="rank-top10" />
                <Label 
                  htmlFor="rank-top10" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Top 10
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="rank-all" />
                <Label 
                  htmlFor="rank-all" 
                  className="text-sm font-normal cursor-pointer"
                >
                  All Institutes
                </Label>
              </div>
            </RadioGroup>
          </div>

        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={onReset}>
        Reset Filters
      </Button>
    </aside>
  );
}
