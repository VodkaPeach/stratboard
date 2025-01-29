"use client"
import { useEffect, useRef, useState } from 'react';
import {fabric} from 'fabric';
import { useAppStore } from '@/app/providers/app-store-provider';
import { svgPaths } from '@/app/library/data';

const Canvas = () => {
    const {map, canvas, changeCanvas, isAttack, svgMaps, changeSVGMaps, 
    currentMapObject, changeCurrentMapObject, draggableSrc, setDraggableSrc, setIsDrawing, SwitchIsAlly,
    isDrawing, isErasingMode, isErasing, setIsErasing, dragZoomLevel, isAlly, lockRotation, isDeleting, draggableType,
    brushWidth, brushColor, stepState, currentStep, setCurrentStep, stepDeletedObjects,lockScalingY
    } = useAppStore((state)=>state)
    const [hoveredObject, setHoveredObject] = useState<fabric.Object | null>(null)
    const [dragTarget, setDragTarget] = useState<fabric.Object | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [iconDropPos, setIconDropPos] = useState({x: 0, y: 0})
    interface LoadedSVG {
        path: string;
        svg: fabric.Object;
    }

    const removeObjectFromStepsForward = (object: fabric.Object) => {
        for(let i = currentStep-1; i<10; i++) {
            stepDeletedObjects[i].push(object)
        }
    }

    useEffect(()=>{
      console.log("SVG LOAD useEffect")
        Promise.all<LoadedSVG>(
            svgPaths.map((path: string) =>
              new Promise((resolve, reject) => {
                fabric.loadSVGFromURL(`/minimap/${path}.svg`, (objects, options) => {
                  if (objects) {
                    resolve({ path, svg: fabric.util.groupSVGElements(objects, options) });
                  } else {
                    reject(`Failed to load ${path}`);
                  }
                });
              })
            )
          ).then((svgData) => {
            const svgMapGroups: Record<string, fabric.Object> = {};
            svgData.forEach(({ path, svg }) => {
              svgMapGroups[path] = svg;
            });
            changeSVGMaps(svgMapGroups);
          }).catch((error) => console.error(error));
    }, [])

    useEffect(() => {
        console.log("canvas useEffect ")
        if (canvasRef.current) {
            const fabricCanvas = new fabric.Canvas(canvasRef.current, {
                width:1100,
                height:600,
                fireMiddleClick: true,
                stopContextMenu: true, 
                selection: false,
                preserveObjectStacking: true,
                isDrawingMode:isDrawing,
            });

            changeCanvas(fabricCanvas);
    
            fabricCanvas.backgroundColor = 'black';
            fabric.Object.prototype.selectable = false;
            fabric.Image.prototype._controlsVisibility = {
              bl: false,
              br: false,
              mb: false,
              ml: false,
              mr: false,
              mt: false,
              tl: false,
              tr: false,
              mtr: false,
          };

            fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);

            fabricCanvas.renderAll();

            // Prevent default behavior for dragover to allow drops
            const handleDragOver = (event: DragEvent) => {
              event.preventDefault();
              
          };
          // Handle drop event to create a new image instance on the canvas
          const handleDrop = (event: DragEvent) => {
            event.preventDefault();
            const imageUrl = event.dataTransfer?.getData('text/plain');
            
            if (imageUrl) {
                setDraggableSrc(imageUrl)
            }
          };
          
            // Attach event listeners to the canvas container
            const canvasContainer = canvasRef.current.parentNode as HTMLElement | null;
            if (canvasContainer){
                canvasContainer.addEventListener('dragover', handleDragOver as EventListener);
                canvasContainer.addEventListener('drop', handleDrop as EventListener);
            }
            return () => {
                if (canvasContainer) {
                  canvasContainer.removeEventListener('dragover', handleDragOver);
                  canvasContainer.removeEventListener('drop', handleDrop);
                }
                fabricCanvas.dispose();
            };
        }
    }, [svgMaps]);

    // default drawing preferences
    useEffect(() => {
        if(canvas?.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = brushColor;
            canvas.freeDrawingBrush.width = brushWidth as number;
            //canvas.freeDrawingBrush.cursorStyle = 'default';
        }
    }, [canvas, brushWidth, brushColor])

    useEffect(()=>{
      console.log("set isDrawing useEffect")
      if(canvas){
        canvas.isDrawingMode=isDrawing
      }
    },[isDrawing])

    

    // initial load step
    useEffect(()=>{
        setCurrentStep(1);
    }, [])

    // load step
    useEffect(() => {
        // remove all objects except map
        const activeObjects = canvas?.getObjects().slice(1,)
        canvas?.remove(...activeObjects!)
        // add all from previous steps
        for(let i=0; i<currentStep; i++) {
            stepState[i].forEach((object) => {
                if(!stepDeletedObjects[currentStep-1].includes(object)){
                    canvas?.add(object)
                }
            })
        }
    }, [currentStep])

    useEffect(()=>{
      console.log("drag drop icon useEffect")
      // drag and drop icon
      if (draggableSrc){
        fabric.Image.fromURL(draggableSrc, (img) => {
          // shared properties among all draggable types:
          img.set({
            left: iconDropPos["x"],
            hasBorders: false,
            top: iconDropPos["y"],
            originX: 'center',
            originY: 'center',
            selectable: true,
          });
          // each type's unique properties:
          switch(draggableType){
            case "AgentIcon":
              img.scale(0.05);
              if (isAlly) {
                img.backgroundColor = '#42ffec';
              }
              else {
                img.backgroundColor = "#ff4242";
              }
              img.hasControls = false;
              break;
            case "UtilIconDefault":
              img.scale(0.03);
              img.hasControls = false;
              break;
            case "UtilIconCustom":
              img.scale(0.4);
              img.setControlsVisibility({mtr: true, mb: true});
              canvas?.setActiveObject(img)
              break;
            default:
          }
          
          img.lockScalingX=true
          img.lockScalingY=lockScalingY
          img.lockRotation=lockRotation
          img.hasControls= !lockScalingY || !lockRotation
          canvas?.add(img);
          stepState[currentStep-1].push(img)
          canvas?.renderAll();
          setDraggableSrc('')
      });
      }
       
    }, [draggableSrc, lockRotation, lockScalingY])

    useEffect(()=>{
        canvas?.on("mouse:over", (e)=>{
            if (e.target?.isType("image")){
                console.log(e.target)
                setHoveredObject(e.target)
            }
        })
        return () => {
            canvas?.off("mouse:over")
        }
    }, [canvas])

    useEffect(()=> {
        if(hoveredObject && isDeleting){
            canvas?.remove(hoveredObject)
            removeObjectFromStepsForward(hoveredObject)
        }
    }, [isDeleting, hoveredObject])


    useEffect(()=>{
      console.log("clear canvas useEffect")
      if(canvas){
        canvas.remove(...canvas.getObjects())
      }
    },[map])

    // Load map on the canvas
    useEffect(() => {
      console.log("load map useEffect")
      if (canvas) {
        if (svgMaps) {
            const mapObject = svgMaps[map]
            mapObject.selectable=false;
            mapObject.objectCaching=false;
            changeCurrentMapObject(mapObject);
            canvas.add(mapObject)
            canvas.renderAll()
        }
      }
    }, [canvas,map]);

    // flip map useEffect
    useEffect(()=>{
        const objects = canvas?.getObjects()
        objects?.slice(1, ).forEach((e)=>{
            e.set({flipY:true, flipX: true})
        })
        const group = new fabric.Group(objects, {
            flipY: true,
            flipX: true
        })
        canvas?.add(group)
        group.destroy();
        canvas?.remove(group);
        objects?.forEach((e)=>{
            e.set("dirty", true);
        })
        canvas?.remove(...objects!)
        canvas?.add.apply(canvas, objects!)
        //stepState[currentStep].push(...objects!)
        console.log(isAttack, objects)
        canvas?.renderAll()
    }, [isAttack])

    // zoom canvas and drop, dependency: canvas
    useEffect(()=>{
      if (canvas) {
        canvas.on('mouse:wheel', (opt) => {
            
          const delta = opt.e.deltaY;
          let zoom:number = canvas.getZoom();
          zoom*=0.999**delta;
          if(zoom>2) zoom=2;
          if(zoom<0.5) zoom=0.5;
          canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
          opt.e.preventDefault();
          opt.e.stopPropagation();
        });
        canvas.on('drop', (opt)=>{
            const pointer = canvas.getPointer(opt.e);
            setIconDropPos({x: pointer!.x, y:pointer!.y})
        })
      }
      return () => {
        canvas?.off("drop");
        canvas?.off('mouse:wheel')
      }
    }, [canvas])

    // mouse down/move/up effect, dependency: isDrawing, isErasing, currentMapObject
    useEffect(()=>{
      console.log("mouse move event useEffect")
        if(canvas){            
            canvas.on('mouse:move', function(this: any, opt) {
              if (isErasing) {
                const erasingTarget = opt.target;
                if (erasingTarget?.isType("path") ){
                    removeObjectFromStepsForward(erasingTarget)
                    canvas.remove(erasingTarget);
                    canvas.renderAll();
                }
              }
              if (this.isDragging) {
                var e = opt.e;
                var vpt = this.viewportTransform;
                vpt[4] += e.clientX - this.lastPosX;
                vpt[5] += e.clientY - this.lastPosY;
                this.renderAll();
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
              }
            });
        };
        return () => {
          canvas?.off('mouse:move')
        }
    }, [currentMapObject, isDrawing, isErasing])

  // mouse down useEffect, dependency: currentMapObject, isDrawing
  useEffect(()=>{
    if(canvas){
      canvas.on('mouse:down', function(this: any, opt){
        if (opt.target?.isType("image")) {
            setDragTarget(opt.target)
        }
        if(isErasingMode){
          setIsErasing(true)
          //console.log("mouse down start erasing")
        }
        var evt = opt.e;
        console.log("drawing mode: "+isDrawing+isErasingMode)
        if (!canvas.isDrawingMode && !isErasingMode){
          if (!opt.target || opt.target==currentMapObject) {
            console.log("triggered")
            this.isDragging = true;
            this.selection = false;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
          }
        }
      })
    }
    return () => {
      canvas?.off("mouse:down");
    }
  }, [isDrawing, currentMapObject, isErasingMode])

  useEffect(()=>{
    if(canvas){
      canvas.on('mouse:up', function(this: any, opt) {
        if (isDeleting && dragTarget) {
            canvas.remove(dragTarget)
        }
        setDragTarget(null);
        if(isErasing){
          setIsErasing(false)
          //console.log("mouse up stop erasing")
        }
        // on mouse up recalculate new interaction
        // for all objects, so we call setViewportTransform
        if(this.isDragging){
          this.setViewportTransform(this.viewportTransform);
          this.isDragging = false;
        }
        
      }
      
    );
    }
    return () => {
      canvas?.off("mouse:up");
    }
  }, [canvas, isErasing, isDeleting])

  useEffect(()=>{
    canvas?.on("path:created", (e)=>{
        stepState[currentStep-1].push(canvas?.getObjects().at(-1)!)
    })
    return () => {
        canvas?.off("path:created")
    }
  })
  

    return (
        <div >
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Canvas;