import React, { useState } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";

const WaterMarkComponent = () => {
  const [watermarkImage, setWatermarkImage] = useState("");
  const [waterMarkVisible, setWaterMarkVisible] = useState(false);
  const [watermarkSize, setWatermarkSize] = useState({ width: 300, height: 300 });

  const handleWaterMarkChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWatermarkImage(reader.result); // Set the selected image as the watermark
        setWaterMarkVisible(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResize = (event, direction) => {
    const { width, height } = watermarkSize;
    const deltaX = event.movementX;
    const deltaY = event.movementY;

    if (direction === "horizontal") {
      setWatermarkSize({ width: width + deltaX, height });
    } else if (direction === "vertical") {
      setWatermarkSize({ width, height: height + deltaY });
    } else {
      setWatermarkSize({ width: width + deltaX, height: height + deltaY });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleWaterMarkChange} />
      {waterMarkVisible && (
        <Draggable>
          <Watermark
            style={{ width: `${watermarkSize.width}px`, height: `${watermarkSize.height}px` }}
          >
            <img src={watermarkImage || "defaultImage.png"} alt="Watermark" draggable={false} />
            <ResizeHandle
              onMouseDown={(e) => e.stopPropagation()}
              onMouseMove={(e) => handleResize(e, "both")}
            />
          </Watermark>
        </Draggable>
      )}
    </div>
  );
};

const Watermark = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.6; /* Adjust watermark transparency */
  z-index: 10;
  border: 1px dashed #999;
`;

const ResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: #000;
  cursor: se-resize;
`;

export default WaterMarkComponent;
