"use client"
import { useAppStore } from "@/app/providers/app-store-provider";
import { Key, useState } from "react";
import { svgPaths } from "@/app/library/data";
import clsx from "clsx";
import { dictionary } from "@/app/library/data";

export default function MapMenu() {
    const {map, changeMap, isAttack, changeSide} = useAppStore(store=>store)
    const itemList = svgPaths.filter((value)=>value!=map).map((value) => <button className="bg-slate-800 hover:bg-slate-600 w-full h-16 rounded-md" key={value} onClick={()=>updateMap(value)}>{dictionary[value as keyof object]}</button>)
    const [toggled, setToggled] = useState(false)
    const handleToggleMenu = () => {
        setToggled(!toggled)
    }
    function updateMap(key:Key):void{
        const newMap = key as string;
        if (key!=map) {
            changeMap(newMap)
        }
        setToggled(false)
    }
    const handleChangeSide = () => {
        changeSide()
    }
    return(
        <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
                <button onClick={handleToggleMenu} className="w-48 rounded-md h-16 bg-slate-800 hover:bg-slate-600">
                    {dictionary[map as keyof object]}
                </button>
                <button className="w-1/4 rounded-md bg-slate-800 hover:bg-slate-600 px-5" onClick={handleChangeSide}>
                    {isAttack? "攻" : "守"}
                </button>
            </div>
            <div className="overflow-hidden">
                <div className={clsx(
                    "w-full text-center flex flex-col gap-1",
                    {
                        "-mt-[290%] transition-all duration-[1200ms]": toggled === false,
                        "mt-0 transition-all duration-250": toggled===true
                    }
                )}>
                    {itemList}
                </div>
            </div>
            
        </div>
    )
}