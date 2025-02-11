"use client"
import { useEffect, useRef, useState } from 'react';
import {fabric} from 'fabric';
import { useAppStore } from '@/app/providers/app-store-provider';
import { svgPaths } from '@/app/library/data';
import { SITES } from '@/app/library/data';



const Canvas = () => {
    const {map, canvas, changeCanvas, isAttack, svgMaps, changeSVGMaps, 
    currentMapObject, changeCurrentMapObject, draggableSrc, setDraggableSrc,
    isDrawing, isErasingMode, isErasing, setIsErasing, isAlly, isDeleting, draggableType,
    brushWidth, brushColor, stepState, currentStep, setCurrentStep, stepDeletedObjects,abilityProp, iconScale, drawingMode, isDrawingRect,
    setIsDrawingRect, isDrawingLine, setIsDrawingLine
    } = useAppStore((state)=>state)
    const [hoveredObject, setHoveredObject] = useState<fabric.Object | null>(null)
    const [dragTarget, setDragTarget] = useState<fabric.Object | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [iconDropPos, setIconDropPos] = useState({x: 0, y: 0})
    const [DrawRectPos, setDrawRectPos] = useState({x:0, y: 0})
    const [rect, setRect] = useState<fabric.Object | null>(null);
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
                width:2000,
                height:2000,
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
        canvas.isDrawingMode=drawingMode=="line" && isDrawing
        console.log(canvas.isDrawingMode, "isdrawingmode")
      }
    },[drawingMode, isDrawing])

    

    // initial load step
    useEffect(()=>{
        setCurrentStep(1);
    }, [])

    // load step
    useEffect(() => {
        // remove all objects except map
        const activeObjects = canvas?.getObjects().slice(2,)
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

    const lastGoodPos = useRef<{left: number | undefined, top: number | undefined}>({left: 100, top:100})

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
              img.scale(iconScale as number *0.01);
              if (isAlly) {
                img.backgroundColor = '#42ffec';
              }
              else {
                img.backgroundColor = "#ff4242";
              }
              img.hasControls = false;
              break;
            case "UtilIconDefault":
              img.scale(0.3);
              img.backgroundColor = "#0f0d1c"
              img.hasControls = false;
              break;
            case "UtilIconCustom":
              img.scale(0.4);
              img.lockScalingFlip = true;
              img.minScaleLimit = 0.4
              img.on("scaling", ()=>{
                if(img.scaleY! <= 1){
                  lastGoodPos.current = {left: img.left, top: img.top}
                }
                console.log(lastGoodPos.current)
                if(img.scaleY! > 1){
                  img.scaleY = 1
                  img.left = lastGoodPos.current.left
                  img.top = lastGoodPos.current.top
                }
              })
              img.setControlsVisibility({mtr: abilityProp=="R" || abilityProp=="B", mt: abilityProp=="B"});
              canvas?.setActiveObject(img);
              break;
            default:
          }
          canvas?.add(img);
          stepState[currentStep-1].push(img)
          canvas?.renderAll();
          setDraggableSrc('')
      });
      }
       
    }, [draggableSrc, abilityProp, iconScale])

    useEffect(()=>{
        canvas?.on("mouse:over", (e)=>{
            if (e.target?.isType("image") || e.target?.isType('i-text')){
                console.log(e.target, "is hovered")
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

    // flip objects utility function
    const flipObjects = (objects: fabric.Object[], map: fabric.Object) => {
      objects.forEach((object)=>{
        object.flipY=true;
        object.flipX=true;
      });
      const group = new fabric.Group([...objects, map], {
        flipX: true,
        flipY: true
      })
      canvas?.add(group);
      group.destroy();
      canvas?.remove(group);
      [map, ...objects].forEach((object)=>{
        object.dirty=true;
      })
      canvas?.add.apply(canvas, [map, ...objects]);
    }

    // Load map on the canvas
    useEffect(() => {
      console.log("load map useEffect")
      if (canvas) {
        if (svgMaps) {
          canvas?.clear();
            const mapObject = svgMaps[map]
            mapObject.selectable=false;
            mapObject.objectCaching=false;
            
            changeCurrentMapObject(mapObject);
            canvas.add(mapObject)
            const siteTexts = ["A", "B"].map((value, index) => new fabric.Text(value, {
              fill: "white",
              fontSize: 30,
              left: SITES[map][index*2],
              top: SITES[map][index*2+1],
              selectable:true
              //evented: false,
            }))
            console.log(map,"hdusa")
            if (map=="Lotus" || map=="Haven"){
              const cSite = new fabric.Text("C", {
                fill: "white",
                fontSize: 30,
                left: SITES[map][4],
                top: SITES[map][5],
                selectable:true,
                evented: false,
              })
              siteTexts.push(cSite)
            }
            const siteTextGrp = new fabric.Group(siteTexts)
            canvas.add(siteTextGrp)
            if(!isAttack){
              flipObjects(siteTexts, mapObject)
            }
            canvas.renderAll()
        }
      }
    }, [canvas,map]);

    // flip map useEffect
    useEffect(()=>{
        const objects = canvas?.getObjects()
        objects?.slice(1, ).forEach((e)=>{
          e.flipY = true;
          e.flipX=true;
        })
        const group = new fabric.Group(objects, {
            flipY: true,
            flipX: true,
            
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

    // mouse down useEffect, dependency: currentMapObject, isDrawing
    useEffect(()=>{
      if(canvas){
        canvas.on('mouse:down', function(this: any, opt){
          if(isDrawing && drawingMode=="rect"){
            setIsDrawingRect(true)
            const tempRect = new fabric.Rect({
              left:0,
              top: 0,
              width:0,
              height:0,
              stroke:'red',
              strokeWidth:3,
              fill:'',
              selectable:true,
            })
            setRect(tempRect)
            const pointer = canvas.getPointer(opt.e)
            canvas?.add(tempRect)
            setDrawRectPos({x: pointer.x, y: pointer.y})
          }
          if(isDrawing && drawingMode=="line"){
            setIsDrawingLine(true);
          }
          if (opt.target?.isType("image")) {
            setDragTarget(opt.target)
          }
          if(isErasingMode){
            setIsErasing(true)
            //console.log("mouse down start erasing")
          }
          console.log("drawing mode: "+isDrawing+isErasingMode)
          if (!isDrawing && !isErasingMode){
            if (!opt.target || opt.target==currentMapObject) {
              console.log("triggered")
              this.isDragging = true;
              this.selection = false;
              this.lastPosX = opt.e.clientX;
              this.lastPosY = opt.e.clientY;
            }
          }
        })
      }
      return () => {
        canvas?.off("mouse:down");
      }
    }, [isDrawing, currentMapObject, isErasingMode, drawingMode])

    // mouse down/move/up effect, dependency: isDrawing, isErasing, currentMapObject
    useEffect(()=>{
      console.log("mouse move event useEffect")
        if(canvas){            
            canvas.on('mouse:move', function(this: any, opt) {
              if(isDrawingRect && rect){
                const pointer = canvas.getPointer(opt.e)
                console.log(pointer.x, pointer.y, DrawRectPos.x, DrawRectPos.y)
                console.log(Math.abs((pointer.x-DrawRectPos.x)), Math.abs((pointer.y-DrawRectPos.y)))
                const relRectWidth = pointer.x-DrawRectPos.x
                const relRectHeight = pointer.y-DrawRectPos.y
                if(relRectWidth >=0 && relRectHeight>=0){
                  rect.set({
                    left: DrawRectPos.x,
                    top: DrawRectPos.y,
                  })
                }
                else if (relRectWidth <0 && relRectHeight<0){
                  rect.set({
                    left: pointer.x,
                    top: pointer.y,
                  })
                }
                else if (relRectWidth <0 && relRectHeight>=0){
                  rect.set({
                    left: pointer.x,
                    top: DrawRectPos.y
                  })
                }
                else if (relRectWidth >=0 && relRectHeight<0){
                  rect.set({
                    left: DrawRectPos.x,
                    top: pointer.y
                  })
                }
                rect.set({
                  width: Math.abs(relRectWidth),
                  height: Math.abs(relRectHeight)
                })
                console.log(rect, "rect")
                console.log(canvas.getObjects())
                canvas.renderAll()
              }
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
    }, [currentMapObject, isDrawing, isErasing, isDrawingRect, DrawRectPos, rect])

  

  useEffect(()=>{
    if(canvas){
      canvas.on('mouse:up', function(this: any, opt) {
        if(isDrawingRect){
          setIsDrawingRect(false)
        }
        if(opt.target){
          if (opt.target.type=="text"){
            console.log(opt.target.left, opt.target.top)
          }
        }
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
  }, [canvas, isErasing, isDeleting, isDrawingRect])

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