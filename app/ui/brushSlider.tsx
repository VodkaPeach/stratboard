"use client"
import { useAppStore } from "@/app/providers/app-store-provider"
import { Slider } from "@nextui-org/slider"
export default function BrushSizeSlider () {
    const {brushWidth, setBrushWidth} = useAppStore(state=>state)
    return (
        <div>
            <Slider 
                size="sm"
                step={1}
                label="粗细"
                color="foreground"
                showSteps={true} 
                maxValue={5} 
                minValue={1}
                value={brushWidth}
                onChange={setBrushWidth} 
                defaultValue={2}
            />
        </div>
    )
}