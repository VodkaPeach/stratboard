"use client"
import React from "react"
import { useAppStore } from "../providers/app-store-provider"
import clsx from "clsx"
type stepNumberButton = {
    value: number
}
const StepButton: React.FC<stepNumberButton> = ({value}) => {
    const {currentStep, setCurrentStep} = useAppStore(state=>state);
    const handleChangeStep = () => {
        if (value != currentStep) {
            setCurrentStep(value);
        }
    }
    return(
        <button
            className={clsx(
                'w-10 h-10 rounded-md',
                {
                'bg-cyan-800': currentStep === value
            })}
            onClick={handleChangeStep}
        >
            {value}
        </button>
    )
}

export default StepButton