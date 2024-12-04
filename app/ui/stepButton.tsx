"use client"
import React from "react"
import { useAppStore } from "../providers/app-store-provider"
type stepNumberButton = {
    value: number
}
const StepButton: React.FC<stepNumberButton> = ({value}) => {
    const {canvas, currentStep, setCurrentStep, stepState, setStepState} = useAppStore(state=>state);
    const handleChangeStep = () => {
        if (value != currentStep) {
            const currentState = JSON.stringify(canvas);
            const stateCopy = stepState;
            stateCopy[currentStep] = currentState;
            setStepState(stateCopy);
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