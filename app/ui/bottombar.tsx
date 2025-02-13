"use client"
import { useRef, useEffect } from "react";
import Draggable from "./draggable";
import { agents } from "@/app/library/data";
import { useAppStore } from "../providers/app-store-provider";
import Switch from "react-switch";

export default function BottomBar(){
    const {isAlly, SwitchIsAlly} = useAppStore(state=>state)
    const scrollContainerRef = useRef<HTMLDivElement>(null); // Reference to the scrollable container

    const handleAllySwitch = () => {
        SwitchIsAlly();
    }

    useEffect(() => {
      // Function to handle the wheel event
      const handleWheel = (event: { preventDefault: () => void; deltaY: any;}) => {
        // Prevent vertical scroll by calling preventDefault
        event.preventDefault();
        // Check if the container exists, then scroll horizontally based on wheel delta
        if (scrollContainerRef.current!) {
          scrollContainerRef.current!.scrollLeft += event.deltaY;
        }
      };
  
      // Add event listener to the container element
      const container: any = scrollContainerRef.current;
      container!.addEventListener('wheel', handleWheel, { passive: false });
  
      // Cleanup function to remove the event listener when component unmounts
      return () => {
        container!.removeEventListener('wheel', handleWheel);
      };
    }, []);
    
    const agentIconArray = agents.map(
        (path, index) => (
          <Draggable key={path+index} agent={path}/>
        )
    )
    return(
        <div ref={scrollContainerRef} className="flex overflow-auto h-full">  
          <div className="flex items-center">
            <div className="w-28"></div>
            <p className="w-24 text-center">{isAlly? '友方' : '敌方'} </p>
            <Switch 
                onColor="#42ffec"
                offColor="#ff4242"
                checked={isAlly}
                checkedIcon={false}
                uncheckedIcon={false}
                onChange={handleAllySwitch}
            />
            <div className="w-12"></div>
            <div className="flex flex-row gap-1">
              {agentIconArray}
              <div className="w-72 shrink-0"></div>
            </div>
            
          </div>
          
        </div>
    )
}