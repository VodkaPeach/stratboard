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
        <div className="flex flex-col h-screen text-2xl tracking-wider ">
            <div className="bg-slate-950 border-b border-slate-600 h-12 px-60 py-2"><TopNav /></div>
            <div className="flex w-full h-[79%] flex-row border-b border-slate-600">
                <div className="bg-slate-900 border-r border-slate-600 px-3 w-72 overflow-auto"><SideMenu /></div>
                <div onClick={handleResetHover} className="border-r flex-1 overflow-hidden border-slate-600"><Canvas /></div>
                <div className="bg-slate-900"><RightPanel /></div>
            </div>
            <div className="bg-slate-950 h-1/6"><BottomBar /></div>
        </div>
    );
}