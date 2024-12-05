"use client"
import Canvas from "../ui/canvas";
import TopNav from "../ui/topnav";
import SideMenu from "../ui/sidemenu";
import BottomBar from "../ui/bottombar";
import { useAppStore } from "../providers/app-store-provider";
import RightPanel from "../ui/rightPanel";
import { useEffect } from "react";
export default function StratBoard () {
    const {setCurrentHoverAgent, isDrawing, setIsDrawing, isErasing, setIsDeleting, setIsErasing, SwitchIsAlly } = useAppStore(state=>state)
    const handleResetHover = () => {
        setCurrentHoverAgent(null)
    }
    useEffect(()=>{
        const handleKeydown = (e: KeyboardEvent) =>{
            switch(e.key){
                case "e":
                    setIsDeleting(true)
                    break;
                case "q":
                    setIsErasing(false)
                    setIsDrawing(!isDrawing)
                    break;
                case "w":
                    setIsDrawing(false);
                    setIsErasing(!isErasing)
                    break;
                case "r":
                    SwitchIsAlly();
                    break;
                default:
            }
        }
        const handleKeyUp = (e: KeyboardEvent) =>{
            switch(e.key){
                case "e":
                    setIsDeleting(false)
                    break;
                default:
            }
        }
        window.addEventListener("keydown", handleKeydown);
        window.addEventListener("keyup", handleKeyUp)
        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [])
    
    return (
        <div className="flex flex-col h-screen text-2xl">
            <div className="border-b px-60 py-3"><TopNav /></div>
            <div className="flex w-full h-4/5 flex-row border-b">
                <div className="border-r px-3 w-72 overflow-auto"><SideMenu /></div>
                <div onClick={handleResetHover} className="border-r flex-1 overflow-hidden"><Canvas /></div>
                <RightPanel />
            </div>
            <div className="h-1/6"><BottomBar /></div>
        </div>
    );
}