import { fabric } from "fabric";

export default class ArrowBrush<Arrow> extends fabric.PencilBrush{
    constructor(canvas: fabric.Canvas){
        super(canvas);
        this.arrowHead = null;
    }
    
}