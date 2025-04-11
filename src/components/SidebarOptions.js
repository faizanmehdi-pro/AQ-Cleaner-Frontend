import React, { useState } from 'react';
import styled from 'styled-components';
// import { CleanDocument } from '../APIS/CleanDocument';
import { FiType } from 'react-icons/fi';
import { RxMinus, RxDropdownMenu } from 'react-icons/rx';
import { MdHighlight, MdOutlineCheckBox, MdOutlineDateRange, MdOutlineBrandingWatermark, MdOutlineHideImage   } from 'react-icons/md';
import { FaRegNoteSticky, FaFileSignature, FaToggleOff, FaToggleOn } from "react-icons/fa6";
import { ImRadioChecked } from "react-icons/im";
import { BsCircle, BsSquare, BsCheck, BsX, BsPentagon, BsArrowRight, BsTextParagraph } from 'react-icons/bs';
import { FaRegFileAlt, FaAlignLeft, FaAlignRight, FaFileInvoice, FaBorderStyle, FaCrop, FaAdjust, FaSun, FaMoon } from 'react-icons/fa';
import { RiInputField, RiImageAddLine } from "react-icons/ri";
import { CiViewTable } from "react-icons/ci";


const SidebarOptions = (
    { selectedOption,
        onOptionChange,
        uploadedFileURL,
        onBrightnessChange,
        onContrastChange,
        addTextBox,
        setCropMode,
        addSignatureBox,
        addShape,
        addTextAreaBox,
        addStickyNote,
        addInputFieldBox,
        addSelectFieldBox,
        addDateBox,
        addImageBox,
        setTableVisible,
        handleWaterMarkChange,
        waterMarkVisible,
        setWaterMarkVisible
    }
) => {
    // const [isLoading, setIsLoading] = useState(false);
    const [brightness, setBrightness] = useState(1);
    const [contrast, setContrast] = useState(1);

    const handleOptionClick = (option) => {
        onOptionChange(option);
    };

    const adjustBrightness = (amount) => {
        const newBrightness = Math.min(Math.max(brightness + amount, 0.5), 2); // Restrict brightness between 0.5 and 2
        setBrightness(newBrightness);
        onBrightnessChange(newBrightness);
    };
    const adjustContrast = (amount) => {
        const newContrast = Math.min(Math.max(contrast + amount, 0.5), 2); // Contrast between 0.5 and 2
        setContrast(newContrast);
        onContrastChange(newContrast);
    };

    // const handleSubmit = () => {
    //     if (!selectedOption || !uploadedFileURL) {
    //         alert("Please select a region and upload a file.");
    //         return;
    //     }

    //     setIsLoading(true);
    //     const fileData = {
    //         region: selectedOption,
    //         file_url: uploadedFileURL,
    //     };

    //     CleanDocument(fileData)
    //         .then((resp) => {
    //             window.open(resp?.pdf_url);
    //         })
    //         .catch((err) => {
    //             console.log('Upload error:', err);
    //             alert("An error occurred while cleaning the document.");
    //         })
    //         .finally(() => {
    //             setIsLoading(false);
    //         });
    // };

    return (
        <SidebarWrapper>
            <Heading>Select Cleaning Zone</Heading>
            <OptionsList>
                <OptionButton
                    title="Header"
                    isSelected={selectedOption === 'header'}
                    onClick={() => handleOptionClick('header')}
                >
                    <FaRegFileAlt />
                </OptionButton>
                <OptionButton
                    title="Left Side"
                    isSelected={selectedOption === 'left'}
                    onClick={() => handleOptionClick('left')}
                >
                    <FaAlignLeft />
                </OptionButton>
                <OptionButton
                    title="Right Side"
                    isSelected={selectedOption === 'right'}
                    onClick={() => handleOptionClick('right')}
                >
                    <FaAlignRight />
                </OptionButton>
                <OptionButton
                    title="Footer"
                    isSelected={selectedOption === 'footer'}
                    onClick={() => handleOptionClick('footer')}
                >
                    <FaFileInvoice />
                </OptionButton>
                <OptionButton
                    title="All"
                    isSelected={selectedOption === 'frame'}
                    onClick={() => handleOptionClick('frame')}
                >
                    <FaBorderStyle />
                </OptionButton>
            </OptionsList>
            <Heading>Edit</Heading>
            <OptionsList>
                <OptionButton
                    title="Crop"
                    onClick={() => setCropMode(true)}
                >
                    <FaCrop />
                </OptionButton>
                <OptionButton title="Increase Brightness" onClick={() => adjustBrightness(0.1)}>
                    <FaSun />
                </OptionButton>
                <OptionButton title="Decrease Brightness" onClick={() => adjustBrightness(-0.1)}>
                    <FaMoon />
                </OptionButton>
                <OptionButton title="Increase Contrast" onClick={() => adjustContrast(0.1)}>
                    <FaAdjust />
                </OptionButton>
                <OptionButton title="Decrease Contrast" onClick={() => adjustContrast(-0.1)}>
                    <FaAdjust style={{ transform: 'rotate(180deg)' }} />
                </OptionButton>
            </OptionsList>
            <Heading>Add Texting</Heading>
            <OptionsList>
                <OptionButton title="Add Text" onClick={addTextBox}>
                    <FiType />
                </OptionButton>
                <OptionButton title="Text Highlighter" onClick={() => addShape('highlighter')}>
                    <MdHighlight />
                </OptionButton>
                <OptionButton title="Add Paragraph" onClick={addTextAreaBox}>
                    <BsTextParagraph />
                </OptionButton>
                <OptionButton title="Add Sticky Note" onClick={addStickyNote}>
                    <FaRegNoteSticky />
                </OptionButton>
                <OptionButton title="Add Table" onClick={() => setTableVisible(true)}>
                    <CiViewTable  />
                </OptionButton>
            </OptionsList>
            <Heading>Add Shapes</Heading>
            <OptionsList>
                <OptionButton title="Add Circle" onClick={() => addShape('circle')}>
                    <BsCircle />
                </OptionButton>
                <OptionButton title="Add Rectangle" onClick={() => addShape('rectangle')}>
                    <BsSquare />
                </OptionButton>
                <OptionButton title="Add Tick Mark" onClick={() => addShape('tick')}>
                    <BsCheck />
                </OptionButton>
                <OptionButton title="Add Cross Mark" onClick={() => addShape('cross')}>
                    <BsX />
                </OptionButton>
                <OptionButton title="Add Polygon" onClick={() => addShape('polygon')}>
                    <BsPentagon />
                </OptionButton>
                <OptionButton title="Add Arrow" onClick={() => addShape('arrow')}>
                    <BsArrowRight />
                </OptionButton>
                <OptionButton title="Add Line" onClick={() => addShape('line')}>
                    <RxMinus />
                </OptionButton>
            </OptionsList>
            <Heading>Add Forms</Heading>
            <OptionsList>
                <OptionButton title="Add Checkbox" onClick={() => addShape('checkbox')}>
                    <MdOutlineCheckBox />
                </OptionButton>
                <OptionButton title="Add Radio Button" onClick={() => addShape('radio')}>
                    <ImRadioChecked />
                </OptionButton>
                <OptionButton title="Add Input Field" onClick={addInputFieldBox}>
                    <RiInputField />
                </OptionButton>
                <OptionButton title="Add Select Field" onClick={addSelectFieldBox}>
                    <RxDropdownMenu />
                </OptionButton>
                <OptionButton title="Add Date" onClick={addDateBox}>
                    <MdOutlineDateRange />
                </OptionButton>
            </OptionsList>
            <Heading>Add Signature</Heading>
            <OptionsList>
                <OptionButton
                    title="Signature"
                    onClick={addSignatureBox}
                >
                    <FaFileSignature />
                </OptionButton>
            </OptionsList>
            <Heading>Add Image</Heading>
            <OptionsList>
                <OptionButton
                    title="Add Image"
                    onClick={addImageBox}
                >
                    <RiImageAddLine />
                </OptionButton>
            </OptionsList>
            <Heading>Add Water Mark</Heading>
            <OptionsList>
                <OptionButton
                    title="Add Water Mark"
                >
                    
      <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
        <MdOutlineBrandingWatermark  size={16} />
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleWaterMarkChange}
        style={{ display: "none" }} // Hide the input
      />
                </OptionButton>
                {waterMarkVisible ? (
                <OptionButton
                    title="Remove Water Mark"
                    onClick={() => setWaterMarkVisible(false)}
                >
                    <MdOutlineHideImage  />
                </OptionButton>
                ) : ""}
            </OptionsList>
            {/* <StyledButton onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Submit'}
            </StyledButton> */}
        </SidebarWrapper>
    );
};

export default SidebarOptions;

// Styled Components
const Tooltip = styled.div`
    position: absolute;
    bottom: -30px;
    white-space: nowrap;
    background-color: #165277;
    color: #fff;
    font-size: 12px;
    padding: 5px 8px;
    border-radius: 4px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
    pointer-events: none;
    transform: translateY(10px);
`;

const SidebarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-width: 260px;
    background-color: #fff;
    border: 2px solid #ccc;
    border-radius: 8px;
`;

const Heading = styled.h3`
    color: #165277;
    margin-bottom: 10px;
`;

const OptionsList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
`;

const OptionButton = styled.button`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    font-size: 24px;
    background-color: ${({ isSelected }) => (isSelected ? '#165277' : '#e2e8f0')};
    color: ${({ isSelected }) => (isSelected ? '#fff' : '#333')};
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 35px;
    height: 35px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ isSelected }) => (isSelected ? '#144a6c' : '#cbd5e0')};
    }

    &:hover ${Tooltip} {
        opacity: 1;
        visibility: visible;
    }
`;

// const StyledButton = styled.button`
//     height: 45px;
//     width: 100px;
//     background-color: #165277;
//     color: white;
//     font-size: 16px;
//     font-weight: bold;
//     border: none;
//     border-radius: 8px;
//     cursor: pointer;
//     transition: background-color 0.3s ease, box-shadow 0.3s ease;

//     &:hover {
//         background-color: #0056b3;
//         box-shadow: 0 0 8px rgba(0, 91, 187, 0.3);
//     }

//     &:active {
//         background-color: #004494;
//     }

//     &:disabled {
//         background-color: #ccc;
//         cursor: not-allowed;
//     }
// `;
