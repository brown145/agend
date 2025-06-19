import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw, Square, SquareCheckBig, SquareDashed } from "lucide-react";
import React from "react";
import { Separator } from "./ui/separator";

const STEPS = [
  { key: "recap", label: "Recap" },
  { key: "discussion", label: "Discuss" },
  { key: "review", label: "Review" },
] as const;

type MeetingStepperProps = {
  stepContents: {
    recap: (disabled: boolean) => React.ReactNode;
    discussion: (disabled: boolean) => React.ReactNode;
    review: (disabled: boolean) => React.ReactNode;
  };
  activeStep: number;
  setActiveStep: (step: number) => void;
};

export const MeetingStepper: React.FC<MeetingStepperProps> = ({
  stepContents,
  activeStep,
  setActiveStep,
}) => {
  return (
    <div className="flex flex-col gap-0">
      {STEPS.map((step, idx) => (
        <div key={step.key} className="flex flex-row items-start relative">
          {/* Vertical Line */}
          <div
            className={cn(
              "absolute left-6 w-px h-full bg-gray-500",
              idx === 0 ? "top-1.5" : "top-0",
              idx === STEPS.length - 1 ? "h-5" : "h-full",
            )}
          />
          {/* Step Icon */}
          <div className="relative flex flex-col items-center w-12 h-full">
            {/* Step Circle */}
            <div
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-200 z-10 mt-0 mb-0 bg-white",
              )}
            >
              {idx === activeStep ? (
                <Square
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => setActiveStep(idx + 1)}
                />
              ) : idx < activeStep ? (
                <div className="group relative">
                  <SquareCheckBig className="w-5 h-5 group-hover:opacity-0" />
                  <RotateCcw
                    className="w-5 h-5 absolute top-0 left-0 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStep(idx);
                    }}
                  />
                </div>
              ) : (
                <SquareDashed
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => setActiveStep(activeStep + 1)}
                />
              )}
            </div>
          </div>
          {/* Step Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-3xl font-semibold leading-7 ${
                  idx === activeStep ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
              {idx < activeStep && (
                <span className="text-xs text-gray-400">(Done)</span>
              )}
            </div>
            <div className={`${idx !== activeStep ? "opacity-50" : ""}`}>
              {stepContents[step.key](idx !== activeStep)}
              {idx === activeStep && (
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <Button
                    className="mx-4 min-w-[180px]"
                    variant="outline"
                    onClick={() => setActiveStep(activeStep + 1)}
                  >
                    Done
                  </Button>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}
              {idx !== activeStep && idx < STEPS.length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
