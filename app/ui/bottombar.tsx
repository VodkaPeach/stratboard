"use client"
import { useRef, useEffect } from "react";
import Draggable from "./draggable";
import { agents } from "@/app/library/data";
import { useAppStore } from "../providers/app-store-provider";
import clsx from "clsx";
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
          <Draggable src={`/agent/${path}_icon.webp`} key={path} agent={path}/>
        )
    )
    return(
        <div ref={scrollContainerRef} className="flex flow-row overflow-auto">  
          <div className="w-70 pl-20 pr-5 py-5">
            <Switch 
                onColor="#42ffec"
                offColor="#ff4242"
                checked={isAlly}
                checkedIcon={false}
                uncheckedIcon={false}
                onChange={handleAllySwitch}
            />
          </div>
          <p className="w-32 text-center py-5">{isAlly? 'Ally' : 'Enemy'} </p>
          <div className="flex my-0.5 pl-5">{agentIconArray}</div>
        </div>
    )
}