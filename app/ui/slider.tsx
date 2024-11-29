"use client"
import { useAppStore } from "@/app/providers/app-store-provider"
import { Slider } from "@nextui-org/slider"
export default function SizeSlider () {
    const {brushWidth, setBrushWidth} = useAppStore(state=>state)
    return (
        <div>
            <Slider 
                size="sm"
                step={1}
                label="Thickness"
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