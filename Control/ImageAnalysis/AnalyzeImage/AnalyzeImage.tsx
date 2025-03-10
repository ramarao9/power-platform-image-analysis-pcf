import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CopyRegular, Image24Regular, ImageAddRegular, DeleteRegular } from "@fluentui/react-icons";
import { Spinner, Image, makeStyles, tokens, Checkbox, Label, Textarea, typographyStyles, Tooltip, Button, Toast } from "@fluentui/react-components";
import type { SpinnerProps, LabelProps, TextareaOnChangeData } from "@fluentui/react-components";
import { ExtractTextBlockRequest } from "./Interfaces/ExtractTextBlockRequest";



export interface AnalyzeImageProps {
    entityId: string;
    entityName: string;
    uploadIcon: string;
    context: ComponentFramework.Context<IInputs> | undefined;
    imageText?:string;
    onImageTextChange: (imageText: string) => void;
}








const useStyles = makeStyles({

    subTitle2: typographyStyles.subtitle2,
    imageAnalysisContainer: {
        display: "grid",
        gridTemplateColumns: '50% 50%',
        height: '100vh',
        maxHeight: '100vh',
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        borderRadius: tokens.borderRadiusMedium
    },
    spinnerContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
    },
    leftContainer: {
        gridColumn: '1',
        margin: '10px',
        display: 'flex',
        flex:'0 0 calc(100% - 20px)',
        maxHeight: 'calc(100vh - 20px)'
    },
    rightContainer: {
        gridColumn: '2',
        display: 'flex',
        flexDirection: 'column',
        margin: '10px',
        flex:'0 0 calc(100% - 20px)',
        maxHeight: 'calc(100vh - 20px)'
    },
    imageParentContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px dashed ${tokens.colorNeutralStroke1}`,
        borderRadius: tokens.borderRadiusMedium,
        backgroundColor: tokens.colorNeutralBackground1
    },
    imageUploadContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageOverlayContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: '100%'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
    },

    deleteButton: {
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
        zIndex: 1
    },
    uploadButton: {
        position: 'absolute',
        bottom: '20px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
    },
    placeholder: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        color: tokens.colorNeutralForeground3
    },




    imageTextBlocksContainer: {
        flex: '0 0 calc(50% - 10px)',
        display: 'flex',
        minHeight: 0,
        flexDirection: 'column',
        marginBottom: '10px'
    },

    textLinesContainer: {
        flex: '0 0 calc(100% - 30px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minHeight: 0,
        marginTop: '10px',
        overflowY: 'auto',
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        borderRadius: tokens.borderRadiusMedium,
        backgroundColor: tokens.colorNeutralBackground1
    },

    imageTextContainer: {
        flex: '0 0 calc(50% - 10px)',
        display: 'flex',
        minHeight: 0,
        flexDirection: 'column',
    },
    textHeader: {
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'center',
        width: '100%',
        marginBottom: '8px'
    },
    selectedTextContainer: {
        flex: '0 0 calc(100% - 20px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        border: '0'
    },
    selectedText: {
        flex: '0 0 1',
        minHeight: 0,
        height: 'calc(100% - 5px) !important',
        overflowY: 'auto'
    }

});



export const AnalyzeImage: React.FC<AnalyzeImageProps> = (analyzeImageProps: AnalyzeImageProps) => {

    const styles = useStyles();
    const [answer, setAnswer] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [textLines, setTextLines] = useState<TextLine[]>([]);
    const [selectedText, setSelectedText] = useState<string | undefined>('');
    const [copyToolTipContent, setCopyToolTipContent] = useState<string>('Copy to clipboard');
    const canvasRef = useRef<HTMLCanvasElement>(null);


    // Handle checkbox change
    const handleCheckedOnLine = (line: TextLine) => {


        const updatedTextLines = textLines.map(l =>
            l.id === line.id
                ? { ...l, checked: !l.checked }
                : l
        )

        // Update textLines array
        setTextLines(updatedTextLines);

        const updatedSelectedText = getSelectedText(updatedTextLines);

        setSelectedText(updatedSelectedText);
        analyzeImageProps.onImageTextChange(updatedSelectedText);
    };


    const getSelectedText = (updatedTextLines: TextLine[]): string => {
        const textLinesSelected = updatedTextLines.filter((line) => line.checked);
        const updatedSelectedText = textLinesSelected.map((line) => line.text).join('\n');

        return updatedSelectedText;
    }

    const handleSelectedTextChange = (_: React.ChangeEvent<HTMLTextAreaElement>, newValue: TextareaOnChangeData) => {
        console.log('Selected Text:', newValue);
        setSelectedText(newValue.value);
        analyzeImageProps.onImageTextChange(newValue.value);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {

                const imageDataUrl = reader.result as string;
                setImage(imageDataUrl);


                // Call the Custom API to extract text from the image
                processImage(imageDataUrl);



            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: false
    });





    const getBase64FromDataUrl = (dataUrl: string): string => {
        // Find the position after "base64,"
        const base64Prefix = "base64,";
        const base64Index = dataUrl.indexOf(base64Prefix);

        if (base64Index === -1) {
            return "";
        }

        // Extract everything after "base64,"
        return dataUrl.substring(base64Index + base64Prefix.length);
    }



    const processImage = async (imageDataUrl: string) => {

        setProcessing(true);


        try {


            const imageData = getBase64FromDataUrl(imageDataUrl);
            const data: ExtractTextBlockRequest = {
                ImageData: imageData
            };

            const imageDataJSON = JSON.stringify(data);

            let textLines: TextLine[] = [];
            let textBlocks: TextBlock[] = [];
            const skip = true;
            //call the Custom API using execute
            if (analyzeImageProps.context && skip) {

                const response = await callCustomAPI("rrk_ExtractTextBlocksFromImage", imageDataJSON);

                const result: ImageAnalysisResult = await response.json();

                textBlocks = extractTextBlocks(result);
                textLines = extractTextLines(textBlocks);

            } else {
                console.error("Context is undefined");

                const responseText ="",
                textBlocks = JSON.parse(responseText);
                textLines = extractTextLines(textBlocks);

            }
            drawBoundingBoxes({ imageUrl: imageDataUrl, textBlocks, canvasRef });
            setTextLines(textLines);
            const updatedSelectedText = getSelectedText(textLines);
            setSelectedText(updatedSelectedText);

            analyzeImageProps.onImageTextChange(updatedSelectedText);
        } catch (error) {
            console.error('Error processing image:', error);
        } finally {
            setProcessing(false); // Hide spinner
        }
    }


    async function callCustomAPI(apiName: string, jsonData: string): Promise<Response> {


        const url = `/api/data/v9.2/${apiName}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    'OData-MaxVersion': '4.0',
                    'OData-Version': '4.0'
                },
                body: jsonData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;

        } catch (error) {
            // Handle errors here
            console.error('Error:', error);
            throw error;
        }
    }

    const drawBoundingBoxes = ({ imageUrl, textBlocks, canvasRef }: DrawBoundingBoxesProps) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const image = new window.Image();
        image.src = imageUrl ?? "";
        image.hidden = true;

        image.onload = () => {
            // Set canvas size to match image
            canvas.width = image.width;
            canvas.height = image.height;

            // Draw original image
            ctx.drawImage(image, 0, 0);

            // Style for bounding boxes
            ctx.strokeStyle = 'hsla(120, 92.10%, 34.90%, 0.80)';
            ctx.lineWidth = 10;

            // Draw boxes for each text block
            textBlocks.forEach(block => {
                block.Lines.forEach(line => {
                    const points = line.BoundingPolygon;

                    ctx.beginPath();
                    // Move to first point
                    ctx.moveTo(points[0].X, points[0].Y);

                    // Draw lines to each subsequent point
                    for (let i = 1; i < points.length; i++) {
                        ctx.lineTo(points[i].X, points[i].Y);
                    }

                    // Close the polygon
                    ctx.closePath();
                    ctx.stroke();

                    // Optional: Add text label
                    //ctx.fillStyle = 'hsla(120, 92.10%, 34.90%, 0.80)';
                   // ctx.fillText(line.Text, points[0].X, points[0].Y - 5);
                });
            });



            const imageURLWithBoundingBoxes = canvas.toDataURL();
            setImage(imageURLWithBoundingBoxes);

        };
    };



    const extractTextLines = (textBlocks: TextBlock[]): TextLine[] => {

        const textLines: TextLine[] = [];
        textBlocks.forEach(block => {
            block.Lines.forEach((line, index) => {
                console.log('Line text:', line.Text);
                textLines.push({ id: index, text: line.Text, checked: true });


            });
        });

        return textLines;

    }

    const extractTextBlocks = (result: ImageAnalysisResult): TextBlock[] => {

        // Parse the nested TextBlocksJSON string
        const textBlocks: TextBlock[] = JSON.parse(result.TextBlocksJSON);

        return textBlocks;
    };


    const handleCopyClick = async () => {
        if (!selectedText) return;

        try {
            await navigator.clipboard.writeText(selectedText);

            setCopyToolTipContent('Copied!');

            // Reset tooltip after delay
            setTimeout(() => {
                setCopyToolTipContent('Copy to clipboard');
            }, 2000);

        } catch (err) {
            console.error('Failed to copy text: ', err);

        }
    }


    const onClearImage = async () => {
        setImage(null);
        setTextLines([]);
        setSelectedText('');

    }

    let processingOverlay = null;
    if (processing) {
        processingOverlay = (
            <div className={styles.imageOverlayContainer}>
                <Spinner appearance="primary" />
                <p>Analyzing image...</p>
            </div>
        );
    }

    let imageDisplayContainer = null;
    if (image) {
        imageDisplayContainer = (
            <div className={styles.imageContainer}>
                <Image src={image} className={styles.image} />
                <Button
                    icon={<DeleteRegular />}
                    appearance="subtle"
                    className={styles.deleteButton}
                    onClick={onClearImage} />
            </div>
        )
    }



    let imageUploadContainer = null;
    if (!image && !processing) {

        imageUploadContainer = (<div {...getRootProps()} className={styles.imageUploadContainer}>

            <ImageAddRegular fontSize={64} />
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the image here ...</p> :
                    <p>Drop image here, or click here to upload</p>
            }
        </div>)
    }

    let textLinesContainer = null;
    if (textLines.length > 0) {
        textLinesContainer = (
            textLines.map((line) => (
                <Checkbox label={line.text} key={line.id} shape="circular"
                    checked={line.checked}
                    onChange={() => handleCheckedOnLine(line)} />
            ))
        );
    }





    return (
        <>

            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    display: 'none',
                    pointerEvents: 'none' // Allows clicking through canvas
                }}
            />

            <div className={styles.imageAnalysisContainer}>

                <div className={styles.leftContainer}>


                    <div className={styles.imageParentContainer}>

                        {imageUploadContainer}

                        {imageDisplayContainer}

                        {processingOverlay}

                    </div>
                </div>

                <div className={styles.rightContainer}>


                    <div className={styles.imageTextBlocksContainer}>

                        <Label className={styles.subTitle2}>Review Text Blocks</Label>
                        <div className={styles.textLinesContainer} >
                            {textLinesContainer}
                        </div>
                    </div>


                    <div className={styles.imageTextContainer}>

                        <div className={styles.textHeader}>

                            <Label className={styles.subTitle2}>Selected Text</Label>

                            <Tooltip content={copyToolTipContent} relationship="label">
                                <Button icon={<CopyRegular />} size="small" appearance="transparent" onClick={handleCopyClick} />
                            </Tooltip>
                        </div>

                        <div className={styles.selectedTextContainer}>
                            <Textarea textarea={{ style: { maxHeight: 'unset', height: '100%' } }} className={styles.selectedText} title="Selected Text"
                                value={selectedText} onChange={(ev, data) => handleSelectedTextChange(ev, data)} />
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}

