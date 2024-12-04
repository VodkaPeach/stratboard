"use client"
import React from "react"
import { useAppStore } from "../providers/app-store-provider"
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
            onClick={handleChangeStep}
        >
            {value}
        </button>
    )
}

export default StepButton