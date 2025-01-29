"use client"
import Image from "next/image"
import { abilityProps, abilityAlts } from "../library/data"
import { useAppStore } from "../providers/app-store-provider"
type skillComponentProps = {
    agent: string | null,
    skill: string,
    index: number,
}
const Ability: React.FC<skillComponentProps> = ( {agent, skill, index} ) => {
    const {setDragZoomLevel, setLockRotation, setlockScalingY, setDraggableType} = useAppStore(state=>state);

    const handleAbilityDragStart = (event:React.DragEvent<HTMLImageElement>, agent: string, skill: string, index: number) => {
        setDragZoomLevel(0.1);
        setDraggableType("UtilIconDefault");
        switch (abilityProps[agent as keyof {}][index]) {
            case "S":
                setLockRotation(false);
                setlockScalingY(false);
                break;
            case "R":
                setLockRotation(true);
                setlockScalingY(true)
                break;
            default:
                setLockRotation(true);
                setlockScalingY(true);
        }
        let abilitySrc = `/ability/${agent}/${skill}.webp`
        if (abilityAlts[agent as keyof {}][index] != "N"){
            abilitySrc = abilityAlts[agent as keyof {}][index]
            setDraggableType("UtilIconCustom")
            setDragZoomLevel(0.4)
        }
        event.dataTransfer?.setData('text/plain', abilitySrc)
    }
    return (
        <Image 
            src={`/ability/${agent}/${skill}.webp`}
            alt="spell"
            width={60}
            height={60}
            onDragStart={(e)=>handleAbilityDragStart(e, agent!, skill, index)}
        />
    )
}

export default Ability