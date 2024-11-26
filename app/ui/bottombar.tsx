"use client"
import { useRef, useEffect } from "react";
import Draggable from "./draggable";
import { agentIconPaths } from "@/app/library/data";

export default function BottomBar(){
    const scrollContainerRef = useRef<HTMLDivElement>(null); // Reference to the scrollable container

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
    
    const agentIconArray = agentIconPaths.map(
        (path, index) => (
          <Draggable src={path} key={path}/>
        )
    )
    return(
        <div ref={scrollContainerRef} className="flex flow-row overflow-auto">  
          <div>Ally</div>
          <div className="flex my-0.5">{agentIconArray}</div>
        </div>
    )
}