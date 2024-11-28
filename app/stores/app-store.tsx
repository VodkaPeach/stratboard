// src/stores/map-store.tsx
import { createStore } from 'zustand/vanilla'

export type AppState = {
  map: string
  canvas: fabric.Canvas | null
  isAttack: boolean
  svgMaps: {[key: string]: fabric.Object} | null
  currentMapObject: fabric.Object | null
  draggableSrc: string | null
  isDrawing: boolean
  isErasing: boolean
  isErasingMode: boolean
  brushThickness: number | number[]
  currentHoverAgent: string | null
  dragZoomLevel: number
  isAlly: boolean
  lockRotation: boolean
  isDeleting: boolean
}

export type AppActions = {
  changeMap: (newApp: string) => void
  changeCanvas: (newCanvas: fabric.Canvas) => void
  changeSide: () => void
  changeSVGMaps: (newSVGMaps: {[key: string]: fabric.Object}) => void
  changeCurrentMapObject: (newMapObject: fabric.Object) => void
  setDraggableSrc: (newSrc: string)=> void
  setIsDrawing: (newIsDrawing: boolean) => void
  setIsErasingMode: (newIsErasingMode: boolean) => void
  setIsErasing: (newIsErasing: boolean) => void
  setBrushThickness: (newThickness: number | number[]) => void
  setCurrentHoverAgent: (newHover: string | null) => void
  setDragZoomLevel: (newZoomLevel: number) => void
  SwitchIsAlly: () => void
  setLockRotation: (newLock: boolean) => void
  setIsDeleting: (newIsDelete: boolean) => void
}

export type AppStore = AppState & AppActions

export const initAppStore = ():AppState=>{
  return {map: "Ascent", canvas: null, isAttack: true, svgMaps: null, 
    currentMapObject: null, draggableSrc: null, 
    isDrawing:false,isErasing:false, isErasingMode:false, 
    brushThickness: 2, currentHoverAgent: null, 
    dragZoomLevel: 1, isAlly: true,
    lockRotation: true,
    isDeleting: false
}
}

export const defaultInitState: AppState = {
  map: "Abyss",
  canvas: null,
  isAttack: true,
  svgMaps: null,
  currentMapObject: null,
  draggableSrc: null,
  isDrawing:false,
  isErasing:false,
  isErasingMode:false,
  brushThickness: 2,
  currentHoverAgent: null,
  dragZoomLevel: 1,
  isAlly: true,
  lockRotation: true,
    isDeleting: false
}

export const createAppStore = (
  initState: AppState = defaultInitState,
) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    changeMap: (newMap) => set(() => ({ map: newMap })),
    changeCanvas: (newCanvas) => set(()=>({canvas: newCanvas})),
    changeSide: () => set((state)=>({isAttack: !state.isAttack})),
    changeSVGMaps: (newSVGMaps) => set(()=>({svgMaps: newSVGMaps})),
    changeCurrentMapObject: (newMapObject) => set(()=>({currentMapObject: newMapObject})),
    setDraggableSrc: (newSrc)=>set(()=>({draggableSrc: newSrc})),
    setIsDrawing: (newIsDrawing) => set(()=> ({isDrawing: newIsDrawing})),
    setIsErasing: (newIsErasing) => set(()=> ({isErasing: newIsErasing})),
    setIsErasingMode: (newIsErasingMode) => set(()=> ({isErasingMode: newIsErasingMode})),
    setBrushThickness: (newThickness) => set(()=>({brushThickness: newThickness})),
    setCurrentHoverAgent: (newHover) => set(()=>({currentHoverAgent: newHover})),
    setDragZoomLevel: (newZoomLevel) => set(()=>({dragZoomLevel: newZoomLevel})),
    SwitchIsAlly: () => set((state) => ({isAlly: !state.isAlly})),
    setLockRotation: (newLock) => set((state)=>({lockRotation: newLock})),
    setIsDeleting: (newIsDelete) => set(()=>({isDeleting: newIsDelete}))
  }))
}
