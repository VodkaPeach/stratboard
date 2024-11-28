"use client"
import { useAppStore } from "../providers/app-store-provider"
import { useFloating, offset } from "@floating-ui/react"
const RightPanel = () => {
    const {setIsDeleting} = useAppStore(state=>state)
    const {refs, floatingStyles, context} = useFloating({
        middleware: [offset(10)],
        placement: 'left',
    });
    const handleDeleteOn = () => {
        setIsDeleting(true)
    }
    const handleDeleteOff = () => {
        setIsDeleting(false)
    }
    return (
        <div className="w-72" >
            <div ref={refs.setReference}>
                Right Panel
            </div>
            <div
                ref={refs.setFloating}
                style={floatingStyles}
                className="bg-orange-700 w-20 h-20"
                onMouseEnter={handleDeleteOn}
                onMouseLeave={handleDeleteOff}
            >
                text
            </div>
        </div>
    )
}

export default RightPanel