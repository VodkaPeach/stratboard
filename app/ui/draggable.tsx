'use client';
import React, { ReactNode } from "react";
import Image from "next/image";
import {useFloating, autoUpdate, offset, shift, useHover, useInteractions} from '@floating-ui/react';
import { useState } from "react";
import { useAppStore } from "../providers/app-store-provider";
import Ability from "./abilityDraggable";
type MyComponentProps = {
    agent: string | null;
};
const Draggable: React.FC<MyComponentProps> = ( {agent}) => {
    const {currentHoverAgent, setCurrentHoverAgent, setDragZoomLevel, setDraggableType} = useAppStore(state=>state);
    const [isPop, setIsPop] = useState(false)
    const {refs, floatingStyles, context} = useFloating({
        open: isPop,
        onOpenChange: setIsPop,
        middleware: [offset(10)],
        whileElementsMounted: autoUpdate,
        placement: 'top',
    });
    const handlePop=()=>{
        setCurrentHoverAgent(agent)
    }
    const hover = useHover(context, {
        enabled: agent==currentHoverAgent,
    });
    const {getFloatingProps} = useInteractions([
        hover,
      ]);

    const handleAgentDragStart = (event:React.DragEvent<HTMLImageElement>, src: string) => {
        setDragZoomLevel(0.05)
        setDraggableType("AgentIcon")
        event.dataTransfer?.setData('text/plain', src)
    }
    const abilities = ["c", "q", "e", "x"].map((skill, index) => 
        (<Ability
            key={skill+index} 
            agent={agent}
            skill={skill}
            index={index}
        />)
    )
    return(
        <>
            <Image 
                src={`/agent/${agent}_icon.webp`}
                alt={'agent icon'} 
                draggable={true}
                width={85}
                height={85}
                className="bg-slate-800 hover:bg-sky-800 rounded-lg" 
                onDragStart={(e)=>handleAgentDragStart(e, `/agent/${agent}_icon.webp`)}
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