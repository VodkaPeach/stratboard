"use client"
import { useAppStore } from "@/app/providers/app-store-provider"
import { Slider } from "@nextui-org/slider"
export default function IconSizeSlider () {
    const {iconScale, setIconScale} = useAppStore(state=>state)
    return (
        <div>
            <Slider 
                size="sm"
                step={1}
                label="英雄图标尺寸"
                color="foreground"
                showSteps={true} 
                maxValue={4} 
                minValue={2}
                value={iconScale}
                onChange={setIconScale} 
                defaultValue={3}
            />
        </div>
    )
}