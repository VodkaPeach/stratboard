"use client"
import Canvas from "../ui/canvas";
import TopNav from "../ui/topnav";
import SideMenu from "../ui/sidemenu";
import BottomBar from "../ui/bottombar";
import { useAppStore } from "../providers/app-store-provider";
export default function StratBoard () {
    const {setCurrentHoverAgent} = useAppStore(state=>state)
    const handleResetHover = () => {
        setCurrentHoverAgent(null)
    }
    return (
        <div className="flex flex-col h-screen text-2xl">
            <div className="border-b px-60 py-3"><TopNav /></div>
            <div className="flex w-full h-4/5 flex-row border-b">
                <div className="border-r px-3 w-72 overflow-auto"><SideMenu /></div>
                <div onClick={handleResetHover} className="border-r flex-1 overflow-hidden"><Canvas /></div>
                <div className="w-72"></div>
            </div>
            <div className="h-1/6"><BottomBar /></div>
        </div>
    );
}