// Interfaces for type safety
interface Point {
    X: number;
    Y: number;
}

interface Word {
    Text: string;
    BoundingPolygon: Point[];
    Confidence: number;
}

interface Line {
    Text: string;
    BoundingPolygon: Point[];
    Words: Word[];
}

interface TextBlock {
    Lines: Line[];
}

interface ImageAnalysisResult {
    "@odata.context": string;
    TextBlocksJSON: string;
}


interface TextLine{
    text: string;
    id:number;
    checked:boolean;
}



interface DrawBoundingBoxesProps {
    imageUrl: string |null;
    textBlocks: TextBlock[];
    canvasRef: React.RefObject<HTMLCanvasElement>;
}