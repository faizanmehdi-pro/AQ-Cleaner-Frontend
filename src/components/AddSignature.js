import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';

const SignatureApp = () => {
    const [signatureBoxes, setSignatureBoxes] = useState([]);
    const [signatureVisible, setSignatureVisible] = useState(false);
    const [newSignaturePosition, setNewSignaturePosition] = useState({ x: 10, y: 10 });
    const [hoveredSignatureIndex, setHoveredSignatureIndex] = useState(null);
    const [hoveredSignature, setHoveredSignature] = useState(false);
    const [signatureSize, setSignatureSize] = useState({ width: 200, height: 200 });
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);

    const addSignatureBox = () => {
        setNewSignaturePosition({ x: 10, y: 70 });
        setSignatureVisible(true);
    };

    const handleSubmitSignature = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL();

        setSignatureBoxes([
            ...signatureBoxes,
            {
                signature: dataUrl,
                x: newSignaturePosition.x,
                y: newSignaturePosition.y,
                width: signatureSize.width,
                height: signatureSize.height,
            },
        ]);
        setSignatureVisible(false);
    };

    const updateSignatureBoxPosition = (index, x, y) => {
        setSignatureBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, x, y } : box))
        );
    };

    const updateSignatureBoxSize = (index, width, height) => {
        setSignatureBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, width, height } : box))
        );
    };

    const deleteSignatureBox = (index) => {
        setSignatureBoxes((prev) => prev.filter((_, i) => i !== index));
    };

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    return (
        <div>
            <button onClick={addSignatureBox}>Add Signature Box</button>

            {signatureVisible && (
                <Rnd
                    size={signatureSize}
                    position={{ x: newSignaturePosition.x, y: newSignaturePosition.y }}
                    onDragStop={(e, d) => setNewSignaturePosition({ x: d.x, y: d.y })}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        setNewSignaturePosition(position);
                        setSignatureSize({ width: ref.offsetWidth, height: ref.offsetHeight });
                    }}
                    style={{ cursor: 'move', zIndex: hoveredSignature ? 10 : 4 }}
                    onMouseEnter={() => setHoveredSignature(true)}
                    onMouseLeave={() => setHoveredSignature(false)}
                >
                    <canvas
                        ref={canvasRef}
                        width={signatureSize.width}
                        height={signatureSize.height}
                        style={{ border: '1px solid #165277' }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />
                    {hoveredSignature && (
                        <div>
                            <button onClick={handleSubmitSignature}>Save</button>
                            <button onClick={() => setSignatureVisible(false)}>Delete</button>
                        </div>
                    )}
                </Rnd>
            )}

            {signatureBoxes.map((box, index) => (
                <Rnd
                    key={index}
                    size={{ width: box.width, height: box.height }}
                    position={{ x: box.x, y: box.y }}
                    onDragStop={(e, d) => updateSignatureBoxPosition(index, d.x, d.y)}
                    onResizeStop={(e, direction, ref) =>
                        updateSignatureBoxSize(index, ref.offsetWidth, ref.offsetHeight)
                    }
                    onMouseEnter={() => setHoveredSignatureIndex(index)}
                    onMouseLeave={() => setHoveredSignatureIndex(null)}
                    style={{
                        cursor: 'move',
                        zIndex: hoveredSignatureIndex === index ? 10 : 4,
                        border: hoveredSignatureIndex === index ? '2px dotted #007BFF' : 'none',
                    }}
                >
                    <img
                        src={box.signature}
                        alt="Signature"
                        style={{ width: '100%', height: '100%' }}
                    />
                    {hoveredSignatureIndex === index && (
                        <div>
                            <button onClick={() => deleteSignatureBox(index)}>Delete</button>
                        </div>
                    )}
                </Rnd>
            ))}
        </div>
    );
};

export default SignatureApp;
