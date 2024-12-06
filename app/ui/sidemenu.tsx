'use client'
import MapMenu from "./dropdown"
import SizeSlider from "./slider"
import { useAppStore } from "@/app/providers/app-store-provider"
import { colorPalette } from "../library/data"
import StepButton from "./stepButton"
export default function SideMenu(){
    const {
        changeSide, 
        isDrawing, setIsDrawing, 
        isErasingMode, setIsErasingMode, 
        canvas,
        setBrushColor,
        setStepState,
        setStepDeletedObjects
    } = useAppStore(state=>state)
    const handleChangeSide = () => {
        changeSide()
    }
    const handleIsDrawingSwitch = () => {
        setIsErasingMode(false)
        setIsDrawing(!isDrawing)
    }
    const handleIsErasingModeSwitch = () => {
        setIsDrawing(false)
        setIsErasingMode(!isErasingMode)
    }
    const handleDeleteEverything  = () => {
        canvas?.remove(...canvas?.getObjects().slice(1, ))
        setStepState([[],[],[],[],[],[],[],[],[],[]])
        setStepDeletedObjects([[],[],[],[],[],[],[],[],[],[]])
    }
    const handleChangeBrushColor = (color: string) => {
        setBrushColor(color);
    }
    const sequence = [...Array(11).keys()].slice(1).map((value) => <StepButton key={value} value={value}/>)
    const colorBlocks = colorPalette.map((value, index) => <button key={index+value} onClick={()=>{handleChangeBrushColor(value)}} className={`bg-[${value}] w-10 h-10`}></button>)
    return(
        <div className="flex flex-col my-3">
            <div className="flex flex-row basis-1/6">
                <div className="basis-5/6">
                    <MapMenu/>
                </div>
                <button className="w-1/4 rounded-md bg-slate-500" onClick={handleChangeSide}>A</button>
            </div>
            <div className="my-3">
                <div>Sequence</div>
                <div className="grid grid-cols-5 my-2">{sequence}</div>
            </div>
            <div className="my-2 w-full">
                <div>Delete</div>
                <button onClick={handleDeleteEverything}>Everything</button>
                <button>Sequence step 1</button>
            </div>
            <div>
                <div>Tools</div>
                <div className="grid grid-cols-4">
                    <button onClick={handleIsDrawingSwitch}>Pen</button>
                    <button onClick={handleIsErasingModeSwitch}>Eraser</button>
                </div>
                <div>
                    {(isDrawing || isErasingMode) && <div className="">{colorBlocks}</div>}
                    {(isDrawing || isErasingMode) && <SizeSlider />}
                </div>
            </div>
        </div>
    )
}