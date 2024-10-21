import React, { useState, ReactNode, useCallback, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ChevronRight, ChevronLeft } from 'lucide-react'

export interface Step {
  title: string
  content: ReactNode
  onComplete?:()=>void
}

interface WizardProps {
  steps: Step[]
  onComplete: () => void
  onStepChange?: (step: number) => void
  initialStep?:number
  completeButtonText?: string
  nextButtonText?: string
  previousButtonText?: string
}

export default function Wizard({
  steps = [],
  initialStep,
  onComplete,
  onStepChange,
  completeButtonText = 'Completar',
  nextButtonText = 'Siguiente',
  previousButtonText = 'Volver'
}: WizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep || 0)

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => {
        const newStep = prev + 1
        onStepChange?.(newStep)
        return newStep
      })
    } else {
      onComplete()
    }
  }, [currentStep, steps.length, onComplete, onStepChange])

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => {
        const newStep = prev - 1
        onStepChange?.(newStep)
        return newStep
      })
    }
  }, [currentStep, onStepChange])

  if (!steps || steps.length === 0) {
    return null
  }

  useEffect(()=>{
    setCurrentStep(initialStep || 0)
  },[initialStep])

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <div className="flex items-center  justify-between w-full max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <div className="flex flex-col items-center">
                <div
                onClick={()=>setCurrentStep(index)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                     cursor-pointer
                    ${index < currentStep ? 'bg-primary text-white' : 
                      index === currentStep ? 'bg-primary text-white' : 
                      'bg-gray-200 text-gray-500'}
                  `}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-500">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-[1px] -mt-7  
                    ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}
                  `}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {steps[currentStep]?.content || <p>No content available for this step.</p>}
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {previousButtonText}
        </Button>
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? completeButtonText : nextButtonText}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter> */}
    </Card>
  )
}