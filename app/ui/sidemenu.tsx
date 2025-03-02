'use client'
import MapMenu from "./dropdown"
import BrushSizeSlider from "./brushSlider"
import { useAppStore } from "@/app/providers/app-store-provider"
import StepButton from "./stepButton"
import Image from "next/image"
import clsx from "clsx"
import { fabric } from "fabric"
export default function SideMenu(){
    const {
        isDrawing, setIsDrawing, 
        isErasingMode, setIsErasingMode, 
        canvas,
        brushColor,
        setBrushColor,
        setStepState,
        setStepDeletedObjects,
        currentStep,
        drawingMode,
        setDrawingMode,
    } = useAppStore(state=>state)
    const handleChangeDrawingMode = (mode: string) => {
        setDrawingMode(mode)
    }
    const handleIsDrawingSwitch = () => {
        setIsErasingMode(false)
        setIsDrawing(!isDrawing)
    }
    const handleIsErasingModeSwitch = () => {
        setIsDrawing(false)
        
        //genius
        //performance
        if(!isErasingMode){
            canvas?.forEachObject((obj) => {
                obj.dirty = true; // Mark object as needing re-render
                obj.setCoords(); // Refresh object coordinates
              });
              canvas?.requestRenderAll(); // Force redraw
        }
        setIsErasingMode(!isErasingMode)
    }
    const handleDeleteEverything  = () => {
        canvas?.remove(...canvas?.getObjects().slice(1, ))
        setStepState([[],[],[],[],[],[],[],[],[],[]])
        setStepDeletedObjects([[],[],[],[],[],[],[],[],[],[]])
    }
    const handleChangeBrushColor = (color: string) => {
        setBrushColor(color)
    }
    const handleAddTextBox = () => {
        const textBox = new fabric.IText('点击添加文字', {
            fontFamily: 'arial black',
            left: 200,
            top: 200,
            backgroundColor: "#361854",
            //textBackgroundColor: "white",
            selectable: true,
            fontSize: 22,
            fill: "#dacfe6",
            charSpacing: 60,
            lineHeight: 1.2,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            hasControls: false
        });
        canvas?.add(textBox);
        canvas?.renderAll();
    }
    const sequence = [...Array(11).keys()].slice(1).map((value) => <StepButton key={value} value={value}/>)
    const colorBlocks = ['red', 'white', 'yellow'].map((value, index) =>
        <button key={index+value} onClick={()=>handleChangeBrushColor(value)} className={clsx(
            `bg-${value} bg-${value}-600 rounded-md w-5 h-5`,
            {
                'border-1 border-white': brushColor == value
            }
        )}></button>)
    return(
        <div className="flex flex-col my-4 gap-5">
            <div className="flex flex-row basis-1/6">
                <div className="basis-5/6 tracking-widest">
                    <MapMenu/>
                </div>
            </div>
            <div>
                <div>序列</div>
                <div className="grid grid-cols-5 my-2">{sequence}</div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="w-full">删除</div>
                <button className="w-full h-10 bg-cyan-900 hover:bg-cyan-800 rounded-md" onClick={handleDeleteEverything}>所有</button>
                <button className="w-full h-10 bg-slate-700 hover:bg-slate-600 rounded-md">序列第{currentStep}步</button>
            </div>
            <div className="w-full pb-2 flex flex-col gap-2">
                <div>工具</div>
                <div className="flex flex-row gap-2">
                    <button className={clsx(
                        " rounded-md hover:bg-teal-400",
                        {
                            "bg-teal-600": !isDrawing,
                            'bg-teal-200': isDrawing,
                        }

                    )} onClick={()=>handleIsDrawingSwitch()}>
                        <Image className="place-self-center" src={'/tools/pen.svg'} draggable={false} width={40} height={40} alt="PEN"/>
                    </button>
                    <button className={clsx(
                        "rounded-md hover:bg-teal-400",
                        {
                            "bg-teal-600": !isErasingMode,
                            'bg-teal-200': isErasingMode
                        }

                    )} onClick={handleIsErasingModeSwitch}>
                        <Image className="place-self-center" src={'/tools/eraser.svg'} draggable={false} width={40} height={40} alt="Eraser tool"/>
                    </button>
                    <button className="bg-teal-600 rounded-md hover:bg-teal-400" onClick={handleAddTextBox}>
                        <Image className="place-self-center" src={'/tools/text.svg'} draggable={false} width={40} height={40} alt="TEXT"/>
                    </button>
                </div>
                {(isDrawing) && 
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-1">
                        <p className="text-sm mr-4">类型</p>
                        <button className={clsx(
                        " rounded-sm hover:bg-teal-400",
                        {
                            'bg-teal-600': drawingMode!=="line",
                            'bg-teal-200': drawingMode==="line"
                        }

                    )} onClick={()=>handleChangeDrawingMode("line")}>
                            <Image className="place-self-center" src={'/tools/line.svg'} draggable={false} width={25} height={25} alt="line"/>
                        </button>
                        <button className={clsx(
                        "rounded-sm hover:bg-teal-400",
                        {
                            'bg-teal-600': drawingMode!=="arrow",
                            'bg-teal-200': drawingMode==="arrow"
                        }

                    )} onClick={()=>handleChangeDrawingMode("arrow")}>
                            <Image className="place-self-center" src={'/tools/arrow.svg'} draggable={false} width={25} height={25} alt="arrow"/>
                        </button>
                        <button className={clsx(
                        "rounded-sm hover:bg-teal-400",
                        {
                            'bg-teal-600': drawingMode!=="rect",
                            'bg-teal-200': drawingMode==="rect"
                        }

                    )} onClick={()=>handleChangeDrawingMode("rect")}>
                            <Image className="place-self-center" src={'/tools/rect.svg'} draggable={false} width={25} height={25} alt="rect"/>
                        </button>
                    </div>
                    <div className="flex flex-row gap-5">
                        <p className="text-sm">颜色</p>
                        <div className="flex flex-row gap-2">
                            {colorBlocks}
                        </div>
                    </div>
                    
                    {(isDrawing) && <BrushSizeSlider />}
                </div>}
            </div>
        </div>
    )
}