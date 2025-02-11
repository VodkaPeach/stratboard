"use client"
import Canvas from "../ui/canvas";
import TopNav from "../ui/topnav";
import SideMenu from "../ui/sidemenu";
import BottomBar from "../ui/bottombar";
import { useAppStore } from "../providers/app-store-provider";
import RightPanel from "../ui/rightPanel";
import { useEffect } from "react";
export default function StratBoard () {
    const {setCurrentHoverAgent, isDrawing, setIsDrawing, isErasingMode, setIsErasingMode, setIsDeleting, SwitchIsAlly } = useAppStore(state=>state)
    const handleResetHover = () => {
        setCurrentHoverAgent(null)
    }
    const handleIsDrawingSwitch = () => {
        setIsErasingMode(false)
        setIsDrawing(!isDrawing)
    }
    const handleIsErasingModeSwitch = () => {
        setIsDrawing(false)
        setIsErasingMode(!isErasingMode)
    }
    useEffect(()=>{
        let isControlDown = false
        const handleKeydown = (e: KeyboardEvent) =>{
            console.log(e.key)
            switch(e.key){
                case "Control":
                    isControlDown = true;
                    break;
                case "z":
                    if(isControlDown){
                        console.log("undo")
                    };
                    break;
                case "y":
                    if(isControlDown){
                        console.log("redo")
                    };
                    break;
                case "e":
                    setIsDeleting(true)
                    break;
                case "q":
                    handleIsDrawingSwitch()
                    break;
                case "w":
                    handleIsErasingModeSwitch();
                    break;
                case "r":
                    SwitchIsAlly();
                    break;
                default:
            }
        }
        const handleKeyUp = (e: KeyboardEvent) =>{
            switch(e.key){
                case "Control":
                    isControlDown = false;
                    break;
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
    }, [isErasingMode, isDrawing])
    
    return (
        <div className="flex flex-col h-screen text-2xl tracking-wider ">
            <div className="bg-slate-950 border-b border-slate-600 h-[7%] px-60 py-2"><TopNav /></div>
            <div className="flex w-full h-[79%] flex-row border-b border-slate-600">
                <div className="bg-slate-900 border-r border-slate-600 px-3 w-72 overflow-auto"><SideMenu /></div>
                <div onClick={handleResetHover} className="border-r flex-1 overflow-hidden border-slate-600"><Canvas /></div>
                <div className="bg-slate-900"><RightPanel /></div>
            </div>
            <div className="bg-slate-950 h-[14%]"><BottomBar /></div>
        </div>
    );
}