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
  currentHoverAgent: string | null
  dragZoomLevel: number
  isAlly: boolean
  isDeleting: boolean
  brushColor: string
  brushWidth: number | number[]
  currentStep: number
  stepState: fabric.Object[][]
  stepDeletedObjects: fabric.Object[][]
  hoveredObject: fabric.Object | null
  draggableType: string | null
  abilityProp: string
  iconScale: number | number[]
  drawingMode: string
  isDrawingRect: boolean
  isDrawingLine: boolean
  isDrawingArrow: boolean
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
  setCurrentHoverAgent: (newHover: string | null) => void
  setDragZoomLevel: (newZoomLevel: number) => void
  SwitchIsAlly: () => void
  setIsDeleting: (newIsDelete: boolean) => void
  setBrushColor: (newBrushColor: string) => void
  setBrushWidth: (newBrushWidth: number | number[]) => void
  setCurrentStep: (step: number) => void
  setStepState: (newStepState: fabric.Object[][]) => void
  setStepDeletedObjects: (newObjects: fabric.Object[][]) => void
  setHoveredObject: (target: fabric.Object | null) => void
  setDraggableType: (newType: string | null) => void
  setAbilityProp: (prop: string) => void
  setIconScale: (scale: number | number[]) => void
  setDrawingMode: (mode: string) => void
  setIsDrawingRect: (boo: boolean) => void
  setIsDrawingLine: (boo: boolean) => void
  setIsDrawingArrow: (boo: boolean) => void
}

export type AppStore = AppState & AppActions

export const initAppStore = ():AppState=>{
  return {map: "Abyss", canvas: null, isAttack: true, svgMaps: null, 
        currentMapObject: null, draggableSrc: null, 
        isDrawing:false,isErasing:false, isErasingMode:false, 
        currentHoverAgent: null, 
        dragZoomLevel: 1, isAlly: true,
        isDeleting: false,
        brushColor: "white",
        brushWidth: 2,
        currentStep: 0,
        stepState: [[],[],[],[],[],[],[],[],[],[]],
        stepDeletedObjects: [[],[],[],[],[],[],[],[],[],[]],
        hoveredObject: null,
        draggableType: null,
        abilityProp: "N",
        iconScale: 3,
        drawingMode: "line",
        isDrawingRect: false,
        isDrawingLine: false,
        isDrawingArrow: false,
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
    currentHoverAgent: null,
    dragZoomLevel: 1,
    isAlly: true,
    isDeleting: false,
    brushColor: "white",
    brushWidth: 2,
    currentStep: 0, 
    stepState: [[],[],[],[],[],[],[],[],[],[]],
    stepDeletedObjects: [[],[],[],[],[],[],[],[],[],[]],
    hoveredObject: null,
    draggableType: null,
    abilityProp: "N",
    iconScale: 3,
    drawingMode:"line",
    isDrawingRect: false,
    isDrawingLine: false,
    isDrawingArrow: false,
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
    setCurrentHoverAgent: (newHover) => set(()=>({currentHoverAgent: newHover})),
    setDragZoomLevel: (newZoomLevel) => set(()=>({dragZoomLevel: newZoomLevel})),
    SwitchIsAlly: () => set((state) => ({isAlly: !state.isAlly})),
    setIsDeleting: (newIsDelete) => set(()=>({isDeleting: newIsDelete})),
    setBrushColor: (newColor) => set(() => ({brushColor: newColor})),
    setBrushWidth: (newWidth) =>set(() => ({brushWidth: newWidth})),
    setCurrentStep: (step) => set(()=>({currentStep: step})),
    setStepState: (newStepState) => set(()=>({stepState: newStepState})),
    setStepDeletedObjects: (newStepState) => set(()=>({stepState: newStepState})),
    setHoveredObject: (target) => set(()=>({hoveredObject: target})),
    setDraggableType: (newDraggableType) => set(()=>({draggableType: newDraggableType})),
    setAbilityProp: (prop) => set(()=>({abilityProp: prop})),
    setIconScale: (scale) => set(()=>({iconScale: scale})),
    setDrawingMode: (mode) => set(()=>({drawingMode: mode})),
    setIsDrawingRect: (boo) => set(()=>({isDrawingRect: boo})),
    setIsDrawingLine: (boo) => set(()=>({isDrawingLine: boo})),
    setIsDrawingArrow: (boo) => set(()=>({isDrawingArrow: boo})),
  }))
}
