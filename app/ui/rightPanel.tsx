"use client"
import { useAppStore } from "../providers/app-store-provider"
import { useFloating, offset, autoUpdate } from "@floating-ui/react"
import Image from "next/image"
import IconSizeSlider from "./iconSizeSlider"
//import BIN from 'public/next.svg'

const RightPanel = () => {
    const {setIsDeleting} = useAppStore(state=>state)
    const {refs, floatingStyles} = useFloating({
        middleware: [offset(10)],
        whileElementsMounted: autoUpdate,
        placement: 'left-start',
    });
    const handleDeleteOn = () => {
        setIsDeleting(true)
    }
    const handleDeleteOff = () => {
        setIsDeleting(false)
    }
    return (
        <div className="w-72 my-2" >
            <div className="p-2" ref={refs.setReference}>
                b站@六時の雨
            </div>
            <div className="w-5/6 px-3 py-5">
                <IconSizeSlider />
            </div>
            <div
                ref={refs.setFloating}
                style={floatingStyles}
                className="place-content-center  border-3 border-dashed rounded-md border-red-800 w-16 h-16"
                onMouseEnter={handleDeleteOn}
                onMouseLeave={handleDeleteOff}
            >
                <Image className="place-self-center" src={'/trashbin.svg'} width={40} height={40} alt="BIN"/>
            </div>
        </div>
    )
}

export default RightPanel