'use client';
import React from "react";
import Image from "next/image";
import {useFloating, autoUpdate, offset, shift, useHover, useInteractions} from '@floating-ui/react';
import { useState } from "react";
import { useAppStore } from "../providers/app-store-provider";
type MyComponentProps = {
    src: string;
    agent: string | null;
};
const Draggable: React.FC<MyComponentProps> = ( {src, agent}) => {
    const {currentHoverAgent, setCurrentHoverAgent, setDragZoomLevel} = useAppStore(state=>state);
    const [isPop, setIsPop] = useState(false)
    const {refs, floatingStyles, context} = useFloating({
        open: isPop,
        onOpenChange: setIsPop,
        middleware: [shift(), offset(5), shift()],
        whileElementsMounted: autoUpdate,
        placement: 'top',
    });
    const handlePop=()=>{
        setCurrentHoverAgent(agent)
    }
    const hover = useHover(context, {
        enabled: agent==currentHoverAgent,
    });
    const {getReferenceProps, getFloatingProps} = useInteractions([
        hover,
      ]);

    const handleAgentDragStart = (event:React.DragEvent<HTMLImageElement>, src: string) => {
        setDragZoomLevel(0.05)
        event.dataTransfer?.setData('text/plain', src)
    }
    const handleAbilityDragStart = (event:React.DragEvent<HTMLImageElement>, src: string) => {
        setDragZoomLevel(0.1)
        event.dataTransfer?.setData('text/plain', src)
    }
    const abilities = ["c", "q", "e", "x"].map((skill) => 
        <Image
            src={`/ability/${agent}/${skill}.webp`}
            alt="spell"
            width={60}
            height={60}
            onDragStart={(e)=>handleAbilityDragStart(e, `/ability/${agent}/${skill}.webp`)}
        />
    )
    return(
        <>
            <Image 
                src={src}
                alt={'agent icon'} 
                draggable={true}
                width={80}
                height={80}
                className="bg-slate-600 hover:bg-white rounded-lg border-2 border-blue-950" 
                onDragStart={(e)=>handleAgentDragStart(e, src)}
                onMouseEnter={handlePop}
                ref={refs.setReference}
            />
            {currentHoverAgent == agent && 
            <div 
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps} 
                className="flex flex-row bg-gray-800"
                >
                {abilities}
            </div>}
        </>
        
    )
}

export default Draggable