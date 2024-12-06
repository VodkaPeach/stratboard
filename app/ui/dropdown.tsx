import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
  } from "@nextui-org/dropdown";
  import { useAppStore } from "@/app/providers/app-store-provider";
import { Key } from "react";
import { svgPaths } from "@/app/library/data";

export default function MapMenu() {
    const {map, changeMap} = useAppStore(store=>store)
    const itemList = svgPaths.map((value) => <DropdownItem className="bg-slate-600 w-full h-6" key={value}>{value}</DropdownItem>)
    function updateMap(key:Key):void{
        const newMap = key as string;
        if (key!=map) {
            changeMap(newMap)
        }
    }
    return(
        <Dropdown>
            <DropdownTrigger>
                <button className="w-48 rounded-md h-16 bg-slate-600">
                    {map}
                </button>
            </DropdownTrigger>
            <DropdownMenu className="w-36 text-center"
                onAction={(key)=>updateMap(key)}
            >
                {itemList}
            </DropdownMenu>
        </Dropdown>
    )
}