"use client"
import { useAppStore } from "@/app/providers/app-store-provider"
import { Slider } from "@nextui-org/slider"
export default function SizeSlider () {
    const {brushThickness, setBrushThickness} = useAppStore(state=>state)
    const handleValueChange = (value: number | number[]) => {
        setBrushThickness(value)
    }
    return (
        <div>
            <Slider 
                size="sm"
                step={0.1}
                label="Thickness"
                color="foreground"
                showSteps={true} 
                maxValue={1} 
                minValue={0} 
                defaultValue={0.2}
            />
        </div>
    )
}