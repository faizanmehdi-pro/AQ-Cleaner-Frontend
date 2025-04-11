import { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import styled from 'styled-components';
import 'react-pdf/dist/Page/TextLayer.css';
import DropdownOptions from './DropdownOptions';
import { FaToggleOff } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
// import logo from '../assets/logo.jpeg';
// import watermarkImage from '../assets/watermarkimage.png';
import { Rnd } from 'react-rnd';
// import { uploadDocument } from '../APIS/UploadDocument';
import SidebarOptions from './SidebarOptions';
import { FaTimes } from "react-icons/fa";
import { FaUpload } from 'react-icons/fa';
import TableBoxManager from './AddTable';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const PDFViewer = () => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [file, setFile] = useState(null);
    const [uploadedFileURL, setUploadedFileURL] = useState(null);
    const [fileView, setFileView] = useState(false);
    const [fileName, setFileName] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rectanglePosition, setRectanglePosition] = useState([]);
    const [pageDimensions, setPageDimensions] = useState(null);
    const [rectanglePercentage, setRectanglePercentage] = useState({ width: 0, height: 0 });
    const [rectanglePercentageFrame, setRectanglePercentageFrame] = useState([]);
    const [BackgroundColor, setBackgroundColor] = useState('');
    const [brightness, setBrightness] = useState(1);
    const [contrast, setContrast] = useState(1);// Default to top-left corner
    const [cropMode, setCropMode] = useState(false);
    const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: '100%', height: '100%' });
    const [croppedArea, setCroppedArea] = useState(null);
    const [textBoxes, setTextBoxes] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [newText, setNewText] = useState('');
    const [newPosition, setNewPosition] = useState({ x: 10, y: 10 });
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoveredInput, setHoveredInput] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [shapes, setShapes] = useState([]);
    const [hoveredShapeIndex, setHoveredShapeIndex] = useState(null);
    const [textAreaBoxes, setTextAreaBoxes] = useState([]);
    const [textAreaVisible, setTextAreaVisible] = useState(false);
    const [newTextAreaText, setNewTextAreaText] = useState('');
    const [newTextAreaPosition, setNewTextAreaPosition] = useState({ x: 10, y: 10 });
    const [hoveredTextAreaIndex, setHoveredTextAreaIndex] = useState(null);
    const [hoveredTextArea, setHoveredTextArea] = useState(false);
    const [textAreaSize, setTextAreaSize] = useState({ width: 200, height: 200 });

    const [stickyNotes, setStickyNotes] = useState([]);
    const [stickyVisible, setStickyVisible] = useState(false);
    const [newStickyText, setNewStickyText] = useState('');
    const [newStickyPosition, setNewStickyPosition] = useState({ x: 10, y: 10 });
    const [hoveredStickyIndex, setHoveredStickyIndex] = useState(null);
    const [hoveredSticky, setHoveredSticky] = useState(false);
    const [stickySize, setStickySize] = useState({ width: 200, height: 200 });

    const [inputFieldBoxes, setInputFieldBoxes] = useState([]);
    const [inputFieldVisible, setInputFieldVisible] = useState(false);
    const [newInputFieldText, setNewInputFieldText] = useState('');
    const [newInputFieldPosition, setNewInputFieldPosition] = useState({ x: 10, y: 10 });
    const [hoveredInputFieldIndex, setHoveredInputFieldIndex] = useState(null);
    const [hoveredInputField, setHoveredInputField] = useState(false);
    const [inputFieldSize, setInputFieldSize] = useState({ width: 200, height: 50 });

    const [selectFieldBoxes, setSelectFieldBoxes] = useState([]);
    const [selectFieldVisible, setSelectFieldVisible] = useState(false);
    const [newSelectFieldValue, setNewSelectFieldValue] = useState('');
    const [newSelectFieldPosition, setNewSelectFieldPosition] = useState({ x: 10, y: 60 });
    const [hoveredSelectFieldIndex, setHoveredSelectFieldIndex] = useState(null);
    const [selectFieldSize, setSelectFieldSize] = useState({ width: 200, height: 50 });
    const [newOption, setNewOption] = useState('');
    const [editingOption, setEditingOption] = useState({ index: null, value: '' });
    const [editSelectFieldIndex, setEditSelectFieldIndex] = useState(false);

    const [dateBoxes, setDateBoxes] = useState([]);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [newDateValue, setNewDateValue] = useState('');
    const [newDatePosition, setNewDatePosition] = useState({ x: 10, y: 10 });
    const [hoveredDateIndex, setHoveredDateIndex] = useState(null);
    const [hoveredDate, setHoveredDate] = useState(false);
    const [dateBoxSize, setDateBoxSize] = useState({ width: 200, height: 50 });

    const [signatureBoxes, setSignatureBoxes] = useState([]);
    const [signatureVisible, setSignatureVisible] = useState(false);
    const [newSignaturePosition, setNewSignaturePosition] = useState({ x: 10, y: 10 });
    const [hoveredSignatureIndex, setHoveredSignatureIndex] = useState(null);
    const [hoveredSignature, setHoveredSignature] = useState(false);
    const [signatureSize, setSignatureSize] = useState({ width: 250, height: 250 });
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const [selectedPages, setSelectedPages] = useState([]);
    const [deleteSignatureList, setDeleteSignatureList] = useState(false);
    const [selectedDeletePages, setSelectedDeletePages] = useState({});

    const [imageBoxes, setImageBoxes] = useState([]);
    const [imageBoxVisible, setImageBoxVisible] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newImagePosition, setNewImagePosition] = useState({ x: 10, y: 10 });
    const [hoveredImageBoxIndex, setHoveredImageBoxIndex] = useState(null);
    const [imageBoxSize, setImageBoxSize] = useState({ width: 200, height: 200 });
    const [tempSelectedPages, setTempSelectedPages] = useState([]);

    const [tableVisible, setTableVisible] = useState(false);

    const [watermarkImage, setWatermarkImage] = useState("");
    const [waterMarkVisible, setWaterMarkVisible] = useState(false);
    const [watermarkPosition, setWatermarkPosition] = useState({
        x: 50,
        y: 50,
        width: 300,
        height: 200,
    });
    const [isSaveWaterMark, setIsSaveWaterMark] = useState(true);

    const handleWaterMarkChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Reset the file input value
            event.target.value = '';

            const reader = new FileReader();
            reader.onloadend = () => {
                setWatermarkImage(reader.result); // Set the selected image as the watermark
                setWaterMarkVisible(true);
                setIsSaveWaterMark(true);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setNewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const addImageBox = () => {
        setNewImagePosition({ x: 10, y: 70 });
        setImageBoxVisible(true);
    };

    const handleSubmitImageBox = (e) => {
        e.preventDefault();
        if (newImage) {
            setImageBoxes([
                ...imageBoxes,
                {
                    image: newImage,
                    x: newImagePosition.x,
                    y: newImagePosition.y,
                    width: imageBoxSize.width,
                    height: imageBoxSize.height,
                },
            ]);
            setNewImage(null);
            setImageBoxVisible(false);
        }
    };

    const updateImageBoxPosition = (index, x, y) => {
        setImageBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, x, y } : box))
        );
    };

    const updateImageBoxSize = (index, width, height) => {
        setImageBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, width, height } : box))
        );
    };

    const deleteImageBox = (index) => {
        setImageBoxes((prev) => prev.filter((_, i) => i !== index));
    };

    const addSignatureBox = () => {
        setNewSignaturePosition({ x: 10, y: 70 });
        setSignatureVisible(true);
    };

    const handleSubmitSignature = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL();

        // Add new signature box with selected pages
        setSignatureBoxes([
            ...signatureBoxes,
            {
                signature: dataUrl,
                x: newSignaturePosition.x,
                y: newSignaturePosition.y,
                width: signatureSize.width,
                height: signatureSize.height,
                selectedPages: tempSelectedPages, // Use temporary selected pages
            },
        ]);
        setSignatureVisible(false);
        setTempSelectedPages([]); // Reset temporary selected pages
    };

    const toggleTempPageSelection = (pageNumber) => {
        setTempSelectedPages((prev) =>
            prev.includes(pageNumber)
                ? prev.filter((page) => page !== pageNumber)
                : [...prev, pageNumber]
        );
    };

    const updateSignatureBoxPosition = (index, pageNumber, x, y) => {
        setSignatureBoxes((prev) =>
            prev.map((box, i) =>
                i === index
                    ? {
                          ...box,
                          pagePositions: {
                              ...box.pagePositions,
                              [pageNumber]: {
                                  ...box.pagePositions?.[pageNumber],
                                  x,
                                  y, // Update position without affecting size
                              },
                          },
                      }
                    : box
            )
        );
    };
    
    const updateSignatureBoxSize = (index, pageNumber, width, height) => {
        setSignatureBoxes((prev) =>
            prev.map((box, i) =>
                i === index
                    ? {
                          ...box,
                          pagePositions: {
                              ...box.pagePositions,
                              [pageNumber]: {
                                  ...box.pagePositions?.[pageNumber],
                                  width, // Update only width and height for current page
                                  height,
                              },
                          },
                      }
                    : box
            )
        );
    };
// Handle checkbox selection for individual pages
const handlePageSelection = (boxIndex, page, isSelected) => {
    setSelectedDeletePages((prev) => {
        const updatedPages = { ...prev };
        if (isSelected) {
            if (!updatedPages[boxIndex]) updatedPages[boxIndex] = [];
            if (!updatedPages[boxIndex].includes(page)) {
                updatedPages[boxIndex].push(page);
            }
        } else {
            updatedPages[boxIndex] = updatedPages[boxIndex]?.filter((p) => p !== page);
            if (updatedPages[boxIndex].length === 0) delete updatedPages[boxIndex];
        }
        return updatedPages;
    });
};

// Handle "Select All Pages" option
const handleSelectAll = (boxIndex, isSelected, allPages) => {
    setSelectedDeletePages((prev) => {
        const updatedPages = { ...prev };
        if (isSelected) {
            updatedPages[boxIndex] = [...allPages];
        } else {
            delete updatedPages[boxIndex];
        }
        return updatedPages;
    });
};

// Updated deleteSignatureBox function
const deleteSignatureBox = (index, pagesToDelete) => {
    setSignatureBoxes((prev) =>
        prev.map((box, i) =>
            i === index
                ? {
                    ...box,
                    selectedPages: box.selectedPages.filter(
                        (page) => !pagesToDelete.includes(page)
                    ),
                }
                : box
        ).filter((box) => box.selectedPages.length > 0) // Remove boxes with no selected pages left
    );

    // Update selectedDeletePages to synchronize with updated box.selectedPages
    setSelectedDeletePages((prev) => {
        const updated = { ...prev };
        if (updated[index]) {
            updated[index] = updated[index].filter(
                (page) => !pagesToDelete.includes(page)
            );
            if (updated[index].length === 0) delete updated[index];
        }
        return updated;
    });

    setDeleteSignatureList(false);
};

// Ensure "Select All" works consistently
const isSelectAllChecked = (index, selectedDeletePages, boxSelectedPages) => {
    return (
        selectedDeletePages[index]?.length === boxSelectedPages.length &&
        boxSelectedPages.every((page) => selectedDeletePages[index]?.includes(page))
    );
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
    const handleSelectAllPages = () => {
        if (tempSelectedPages.length === numPages) {
            setTempSelectedPages([]); // Deselect all pages
        } else {
            setTempSelectedPages(Array.from({ length: numPages }, (_, index) => index + 1)); // Select all pages
        }
    };



    const handleDateChange = (e) => {
        setNewDateValue(e.target.value);
    };

    const addDateBox = () => {
        setNewDatePosition({ x: 10, y: 70 });
        setDatePickerVisible(true);
    };

    const handleSubmitDate = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (newDateValue.trim()) {
            setDateBoxes([
                ...dateBoxes,
                {
                    date: newDateValue,
                    x: newDatePosition.x,
                    y: newDatePosition.y,
                    width: dateBoxSize.width,
                    height: dateBoxSize.height,
                    isEditing: false,
                },
            ]);
            setNewDateValue('');
            setDatePickerVisible(false);
        }
    };

    const updateDateBoxPosition = (index, x, y) => {
        setDateBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, x, y } : box))
        );
    };

    const updateDateBoxSize = (index, width, height) => {
        setDateBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, width, height } : box))
        );
    };

    const handleDateUpdate = (index, date) => {
        setDateBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, date } : box))
        );
    };

    const toggleEditingDateBox = (index, isEditing = null) => {
        setDateBoxes((prev) =>
            prev.map((box, i) =>
                i === index
                    ? { ...box, isEditing: isEditing !== null ? isEditing : !box.isEditing }
                    : box
            )
        );
        setHoveredDateIndex(false)
    };

    const deleteDateBox = (index) => {
        setDateBoxes((prev) => prev.filter((_, i) => i !== index));
    };


    const changeFontSizeDate = (index, increment) => {
        setDateBoxes((prev) =>
            prev.map((box, i) =>
                i === index ? { ...box, fontSize: (box.fontSize || 16) + increment } : box
            )
        );
    };

    // Add a new select field box
    const addSelectFieldBox = () => {
        setSelectFieldBoxes([
            ...selectFieldBoxes,
            {
                value: '',
                options: ['Option 1', 'Option 2', 'Option 3'], // Default options
                x: newSelectFieldPosition.x,
                y: newSelectFieldPosition.y,
                width: selectFieldSize.width,
                height: selectFieldSize.height,
            },
        ]);
        setSelectFieldVisible(false); // Hide the select field creation area
    };

    // Update the position of a select field
    const updateSelectFieldBoxPosition = (index, x, y) => {
        setSelectFieldBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, x, y } : box))
        );
    };

    // Update the size of a select field
    const updateSelectFieldBoxSize = (index, width, height) => {
        setSelectFieldBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, width, height } : box))
        );
    };

    // Handle the change of selected value
    const handleSelectFieldChange = (index, value) => {
        setSelectFieldBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, value } : box))
        );
    };

    // Add a new option to the select field
    const addOptionToSelectField = (index) => {
        if (newOption.trim()) {
            setSelectFieldBoxes((prev) =>
                prev.map((box, i) =>
                    i === index ? { ...box, options: [...box.options, newOption] } : box
                )
            );
            setNewOption(''); // Clear the input for adding new options
        }
    };

    // Remove an option from the select field
    const removeOptionFromSelectField = (index, optionIndex) => {
        setSelectFieldBoxes((prev) =>
            prev.map((box, i) =>
                i === index
                    ? {
                        ...box,
                        options: box.options.filter((_, optIdx) => optIdx !== optionIndex),
                    }
                    : box
            )
        );
    };

    // Start editing an option
    const startEditingOption = (index, optIdx, value) => {
        setEditingOption({ index, optIdx, value });
    };

    // Save the edited option
    const saveEditedOption = () => {
        const { index, optIdx, value } = editingOption;
        setSelectFieldBoxes((prev) =>
            prev.map((box, i) =>
                i === index
                    ? {
                        ...box,
                        options: box.options.map((opt, oIdx) =>
                            oIdx === optIdx ? value : opt
                        ),
                    }
                    : box
            )
        );
        setEditingOption({ index: null, value: '' }); // Reset editing state
    };

    // Delete a select field
    const deleteSelectFieldBox = (index) => {
        setSelectFieldBoxes((prev) => prev.filter((_, i) => i !== index));
    };

    const changeFontSizeSelect = (index, increment) => {
        setSelectFieldBoxes((prev) =>
            prev.map((box, i) =>
                i === index ? { ...box, fontSize: (box.fontSize || 16) + increment } : box
            )
        );
    };




    const handleInputFieldChange = (e) => {
        setNewInputFieldText(e.target.value);
    };

    const addInputFieldBox = () => {
        setNewInputFieldPosition({ x: 10, y: 70 });
        setInputFieldVisible(true);
    };

    const handleSubmitInputField = (e) => {
        e.preventDefault();
        setInputFieldBoxes([
            ...inputFieldBoxes,
            {
                text: newInputFieldText, // Empty or non-empty text is now allowed
                x: newInputFieldPosition.x,
                y: newInputFieldPosition.y,
                width: inputFieldSize.width,
                height: inputFieldSize.height,
                fontSize: fontSize,
                isEditing: false,
            },
        ]);
        setNewInputFieldText(''); // Reset input field
        setInputFieldVisible(false); // Hide the input field creation area
    };

    const updateInputFieldBoxPosition = (index, x, y) => {
        setInputFieldBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, x, y } : box))
        );
    };

    const updateInputFieldBoxSize = (index, width, height) => {
        setInputFieldBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, width, height } : box))
        );
    };

    const handleInputFieldUpdate = (index, text) => {
        setInputFieldBoxes((prev) =>
            prev.map((box, i) =>
                i === index ? { ...box, text } : box
            )
        );
    };

    const toggleEditingInputField = (index, isEditing = null) => {
        setInputFieldBoxes((prev) =>
            prev.map((box, i) =>
                i === index
                    ? { ...box, isEditing: isEditing !== null ? isEditing : !box.isEditing }
                    : box
            )
        );
    };

    const deleteInputFieldBox = (index) => {
        setInputFieldBoxes((prev) => prev.filter((_, i) => i !== index));
    };

    const changeInputFieldFontSize = (index, increment) => {
        setInputFieldBoxes((prev) =>
            prev.map((box, i) =>
                i === index ? { ...box, fontSize: box.fontSize + increment } : box
            )
        );
    };

    const handleStickyChange = (e) => {
        setNewStickyText(e.target.value);
    };

    const addStickyNote = () => {
        setNewStickyPosition({ x: 10, y: 70 });
        setStickyVisible(true);
    };

    const handleSubmitSticky = (e) => {
        e.preventDefault();
        if (newStickyText.trim()) {
            setStickyNotes([
                ...stickyNotes,
                {
                    text: newStickyText,
                    x: newStickyPosition.x,
                    y: newStickyPosition.y,
                    width: stickySize.width,
                    height: stickySize.height,
                    fontSize: fontSize,
                    isEditing: false,
                },
            ]);
            setNewStickyText('');
            setStickyVisible(false);
        }
    };

    const updateStickyNotePosition = (index, x, y) => {
        setStickyNotes((prev) =>
            prev.map((note, i) => (i === index ? { ...note, x, y } : note))
        );
    };

    const updateStickyNoteSize = (index, width, height) => {
        setStickyNotes((prev) =>
            prev.map((note, i) => (i === index ? { ...note, width, height } : note))
        );
    };

    const handleStickyUpdate = (index, text) => {
        setStickyNotes((prev) =>
            prev.map((note, i) => (i === index ? { ...note, text } : note))
        );
    };

    const toggleEditingSticky = (index, isEditing = null) => {
        setStickyNotes((prev) =>
            prev.map((note, i) =>
                i === index
                    ? { ...note, isEditing: isEditing !== null ? isEditing : !note.isEditing }
                    : note
            )
        );
    };

    const deleteStickyNote = (index) => {
        setStickyNotes((prev) => prev.filter((_, i) => i !== index));
    };

    const changeStickyFontSize = (index, increment) => {
        setStickyNotes((prev) =>
            prev.map((note, i) =>
                i === index ? { ...note, fontSize: note.fontSize + increment } : note
            )
        );
    };


    const addShape = (type) => {
        const defaultShape = {
            type,
            x: 10,
            y: 10,
            width: type === 'tick' || type === 'cross' || type === 'checkbox' || type === 'radio' ? 25 : 100, // Adjust size based on shape
            height: type === 'tick' || type === 'cross' || type === 'line' || type === 'arrow' || type === 'highlighter' || type === 'checkbox' || type === 'radio' ? 25 : 100,
            rotation: 0, // Rotation for shapes like tick or cross
            backgroundColor: type === 'polygon' ? 'rgba(0, 128, 255, 0.2)' : 'transparent',
            border: '2px solid #000',
            points: type === 'polygon' ? '50,0 100,50 75,100 25,100 0,50' : '', // Polygon-specific
        };
        if (type === 'arrow' || type === 'line') {
            defaultShape.backgroundColor = null; // No background for arrow or line
            defaultShape.border = null; // No border for arrow or line
        }

        if (type === 'highlighter') {
            defaultShape.backgroundColor = 'rgba(255, 255, 0, 0.4)'; // Semi-transparent yellow
            defaultShape.border = null; // No border for highlighter
        }

        setShapes([...shapes, defaultShape]);
    };
    const deleteShape = (index) => {
        const updatedShapes = shapes.filter((_, i) => i !== index);
        setShapes(updatedShapes);
    };


    const handleTextChange = (e) => {
        setNewText(e.target.value);
    };

    const addTextBox = () => {
        setNewPosition({ x: 10, y: 70 });
        setInputVisible(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (newText.trim()) {
            setTextBoxes([
                ...textBoxes,
                {
                    text: newText,
                    x: newPosition.x,
                    y: newPosition.y,
                    width: 150,
                    height: 50,
                    fontSize: fontSize,
                    isEditing: false,
                },
            ]);
            setNewText('');
            setInputVisible(false);
        }
    };

    const updateTextBoxPosition = (index, x, y) => {
        setTextBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, x, y } : box))
        );
    };

    const updateTextBoxSize = (index, width, height) => {
        setTextBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, width, height } : box))
        );
    };

    const handleTextUpdate = (index, text) => {
        setTextBoxes((prev) =>
            prev.map((box, i) =>
                i === index ? { ...box, text } : box
            )
        );
    };

    const toggleEditing = (index, isEditing = null) => {
        setTextBoxes((prev) =>
            prev.map((box, i) =>
                i === index
                    ? { ...box, isEditing: isEditing !== null ? isEditing : !box.isEditing }
                    : box
            )
        );
    };

    const deleteTextBox = (index) => {
        setTextBoxes((prev) => prev.filter((_, i) => i !== index));
    };

    const changeFontSize = (index, increment) => {
        setTextBoxes((prev) =>
            prev.map((box, i) =>
                i === index ? { ...box, fontSize: box.fontSize + increment } : box
            )
        );
    };

    // Text Area Logic


    const handleTextAreaChange = (e) => {
        setNewTextAreaText(e.target.value);
    };

    const addTextAreaBox = () => {
        setNewTextAreaPosition({ x: 10, y: 70 });
        setTextAreaVisible(true);
    };

    const handleSubmitTextArea = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (newTextAreaText.trim()) {
            setTextAreaBoxes([
                ...textAreaBoxes,
                {
                    text: newTextAreaText,
                    x: newTextAreaPosition.x,
                    y: newTextAreaPosition.y,
                    width: textAreaSize.width,
                    height: textAreaSize.height,
                    fontSize: fontSize,
                    isEditing: false,
                },
            ]);
            setNewTextAreaText('');
            setTextAreaVisible(false);
        }
    };

    const updateTextAreaBoxPosition = (index, x, y) => {
        setTextAreaBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, x, y } : box))
        );
    };

    const updateTextAreaBoxSize = (index, width, height) => {
        setTextAreaBoxes((prev) =>
            prev.map((box, i) => (i === index ? { ...box, width, height } : box))
        );
    };

    const handleTextAreaUpdate = (index, text) => {
        setTextAreaBoxes((prev) =>
            prev.map((box, i) =>
                i === index ? { ...box, text } : box
            )
        );
    };

    const toggleEditingTextArea = (index, isEditing = null) => {
        setTextAreaBoxes((prev) =>
            prev.map((box, i) =>
                i === index
                    ? { ...box, isEditing: isEditing !== null ? isEditing : !box.isEditing }
                    : box
            )
        );
    };

    const deleteTextAreaBox = (index) => {
        setTextAreaBoxes((prev) => prev.filter((_, i) => i !== index));
    };

    const changeTextAreaFontSize = (index, increment) => {
        setTextAreaBoxes((prev) =>
            prev.map((box, i) =>
                i === index ? { ...box, fontSize: box.fontSize + increment } : box
            )
        );
    };


    const handleCropToggle = () => setCropMode(!cropMode);




    const handleBrightnessChange = (newBrightness) => setBrightness(newBrightness);
    const handleContrastChange = (newContrast) => setContrast(newContrast);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const onPageRenderSuccess = (pdfPage) => {
        const { width, height } = pdfPage;
        setPageDimensions({ width, height });
    };

    const goToPrevPage = () => setPageNumber((prevPage) => (prevPage - 1 <= 1 ? 1 : prevPage - 1));
    const goToNextPage = () => setPageNumber((prevPage) => (prevPage + 1 >= numPages ? numPages : prevPage + 1));

    const calculateScale = () => {
        const windowWidth = window.innerWidth;
        if (windowWidth >= 1200) {
            setScale(1);
        } else if (windowWidth >= 900) {
            setScale(0.75);
        } else {
            setScale(0.4);
        }
    };


    const increaseScale = () => setScale((prevScale) => Math.min(prevScale + 0.1, 2));
    const decreaseScale = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.1));

    useEffect(() => {
        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, []);


    const handleFileChange = (event) => {
        const chosenFile = event.target.files[0];

        if (chosenFile) {
            setFile(URL.createObjectURL(chosenFile));
            setFileName(chosenFile.name);
        }
    };

    // const handleFileChange = (event) => {
    //     const chosenFile = event.target.files[0];

    //     if (chosenFile) {
    //         setIsLoading(true); // Start loading state
    //         uploadDocument({ file: chosenFile })
    //             .then((resp) => {
    //                 setUploadedFileURL(resp?.file);
    //                 setFile(URL.createObjectURL(chosenFile));
    //                 setFileName(chosenFile.name);
    //             })
    //             .catch((err) => {
    //                 console.log('Upload error:', err);
    //             })
    //             .finally(() => {
    //                 setIsLoading(false); // End loading state
    //             });
    //     }
    // };

    const handleOptionChange = (selected) => {
        setRectanglePosition(getRectangleStyle(selected));
        setSelectedOption(selected);
    };

    const getRectangleStyle = (position) => {
        if (!pageDimensions) return [];

        const { width, height } = pageDimensions;

        switch (position) {
            case 'header':
                setRectanglePercentage({ width: 100, height: 10 });
                setBackgroundColor('rgba(255, 0, 0, 0.3)');
                return [{
                    x: 0,
                    y: 0,
                    width: width,
                    height: height * 0.1,
                }];
            case 'left':
                setRectanglePercentage({ width: 10, height: 100 });
                setBackgroundColor('rgba(255, 0, 0, 0.3)');
                return [{
                    x: 0,
                    y: 0,
                    width: width * 0.1,
                    height: height,
                }];
            case 'right':
                setRectanglePercentage({ width: 10, height: 100 });
                setBackgroundColor('rgba(255, 0, 0, 0.3)');
                return [{
                    x: width * 0.9,
                    y: 0,
                    width: width * 0.1,
                    height: height,
                }];
            case 'footer':
                setRectanglePercentage({ width: 100, height: 10 });
                setBackgroundColor('rgba(255, 0, 0, 0.3)');
                return [{
                    x: 0,
                    y: height * 0.9,
                    width: width,
                    height: height * 0.1,
                }];
            case 'frame':
                const header = { x: 0, y: 0, width: width, height: height * 0.1 };
                const left = { x: 0, y: 0, width: width * 0.1, height: height };
                const right = { x: width * 0.9, y: 0, width: width * 0.1, height: height };
                const footer = { x: 0, y: height * 0.9, width: width, height: height * 0.1 };
                setRectanglePercentageFrame([
                    { width: 100, height: 10 },
                    { width: 10, height: 100 },
                    { width: 10, height: 100 },
                    { width: 100, height: 10 }
                ]);
                setBackgroundColor('rgba(255, 0, 0, 0.3)');
                return [header, left, right, footer];
            case 'all':
                setRectanglePercentage({ width: 100, height: 100 });
                setBackgroundColor('rgba(255, 0, 0, 0.3)');
                return [{
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                }];
            case 'crop':
                setRectanglePercentage({ width: 100, height: 100 });
                setBackgroundColor('rgba(0, 0, 0, 0.2)');
                return [{
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                }];
            case 'red':
                setRectanglePercentage({ width: 100, height: 100 });
                setBackgroundColor('rgba(255, 0, 0, 0.5)');
                return [{
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                }];
            case 'blue':
                setRectanglePercentage({ width: 100, height: 100 });
                setBackgroundColor('rgba(0, 0, 255, 0.5)');
                return [{
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                }];
            case 'orange':
                setRectanglePercentage({ width: 100, height: 100 });
                setBackgroundColor('rgba(255, 165, 0, 0.5)');
                return [{
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                }];
            case 'purple':
                setRectanglePercentage({ width: 100, height: 100 });
                setBackgroundColor('rgba(128, 0, 128, 0.5)');
                return [{
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                }];
            default:
                return [];
        }
    };

    // Render rectangle styles only if it's an array
    const rectangleStyles = Array.isArray(rectanglePosition) ? rectanglePosition : [];

    const updateRectanglePercentage = (newWidthPercentage, newHeightPercentage) => {
        if (!pageDimensions) return;
        setRectanglePercentage({ width: newWidthPercentage, height: newHeightPercentage });
        setRectanglePosition((prev) => (prev.map(rect => ({
            ...rect,
            width: (newWidthPercentage / 100) * pageDimensions.width,
            height: (newHeightPercentage / 100) * pageDimensions.height,
        }))));
    };


    return (
        <>
            {fileView ? (
                <>
                    <Nav>
                        <FileInfo>
                            <IconButton onClick={() => setFileView(false)}>
                                <IoMdArrowRoundBack size={28} color="#165277" />
                            </IconButton>
                            <p>Selected File: {fileName ? <span>{fileName}</span> : 'None'}</p>
                        </FileInfo>
                    </Nav>
                    <PDFViewerWrapper>
                        <Sidebar>
                            <ThumbnailList>
                                {Array.from(new Array(numPages), (el, index) => (
                                    <ThumbnailItem
                                        key={`thumbnail-${index}`}
                                        onClick={() => setPageNumber(index + 1)}
                                        isSelected={pageNumber === index + 1}
                                    >
                                        <Document
                                            file={file}
                                            onLoadSuccess={onDocumentLoadSuccess}
                                            className="thumbnail-document"
                                        >
                                            <Page
                                                pageNumber={index + 1}
                                                scale={0.2} // Scale down for thumbnails
                                            />
                                        </Document>
                                        <PageNumberBadge isSelected={pageNumber === index + 1}>{index + 1}</PageNumberBadge>
                                    </ThumbnailItem>
                                ))}
                            </ThumbnailList>
                        </Sidebar>
                        <PDFContainerSection>
                            <PageInfo>
                                <PageInfoButtons>
                                    <PageInfoButton onClick={goToPrevPage} disabled={pageNumber <= 1}>Prev</PageInfoButton>
                                    <h3>{pageNumber} / {numPages}</h3>
                                    <PageInfoButton onClick={goToNextPage} disabled={pageNumber >= numPages}>Next</PageInfoButton>
                                </PageInfoButtons>
                                <PageInfoButtons>
                                    <PageInfoButton
                                        onClick={() => {
                                            decreaseScale();
                                            setRectanglePosition([]);
                                            setSelectedOption('');
                                        }}
                                    >
                                        -
                                    </PageInfoButton>
                                    <h3>{Math.round(scale * 100)}%</h3>
                                    <PageInfoButton
                                        onClick={() => {
                                            increaseScale();
                                            setRectanglePosition([]);
                                            setSelectedOption('');
                                        }}
                                    >
                                        +
                                    </PageInfoButton>
                                </PageInfoButtons>
                            </PageInfo>
                            <PDFContainer style={{ filter: `brightness(${brightness}) contrast(${contrast})` }}>

                                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                                    <Page
                                        scale={scale}
                                        pageNumber={pageNumber} // Correct the pageNumber reference here
                                        onRenderSuccess={onPageRenderSuccess}
                                        clipPath={croppedArea ? `rect(${croppedArea.y}px, ${croppedArea.x + croppedArea.width}px, ${croppedArea.y + croppedArea.height}px, ${croppedArea.x}px)` : undefined}
                                    >
                                        {waterMarkVisible && (
                                            <Rnd
                                                size={{ width: watermarkPosition.width, height: watermarkPosition.height }}
                                                position={{ x: watermarkPosition.x, y: watermarkPosition.y }}
                                                onDragStop={(e, d) => {
                                                    setWatermarkPosition({ ...watermarkPosition, x: d.x, y: d.y });
                                                }}
                                                style={{
                                                    cursor: 'move',
                                                    zIndex: isSaveWaterMark ? 10 : 0,
                                                    border: isSaveWaterMark ? '2px dotted #007BFF' : 'none',
                                                }}
                                                onResizeStop={(e, direction, ref, delta, position) => {
                                                    setWatermarkPosition({
                                                        width: parseInt(ref.style.width),
                                                        height: parseInt(ref.style.height),
                                                        ...position,
                                                    });
                                                }}
                                                bounds="parent"
                                            >
                                                {isSaveWaterMark && (
                                                    <EditCard>
                                                        <EditIcon onClick={() => setIsSaveWaterMark(false)}>💾</EditIcon>
                                                        <EditIcon onClick={() => setWaterMarkVisible(false)}>🗑️</EditIcon>
                                                    </EditCard>
                                                )}
                                                <Watermark>
                                                    <img src={watermarkImage || "defaultImage.png"} alt="Watermark" draggable={false} />
                                                </Watermark>
                                            </Rnd>
                                        )}
                                    </Page>
                                </Document>
                                {signatureVisible && (
    <SignatureContainer hovered={hoveredSignature} onMouseEnter={() => setHoveredSignature(true)}>
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
        <SignaturePageSelectionHeader>
        <h2>Select Pages</h2>
            <PageOption>
                <input
                    type="checkbox"
                    id="select-all-pages"
                    checked={tempSelectedPages.length === numPages}  // Check if all pages are selected
                    onChange={handleSelectAllPages}
                />
                <label htmlFor="select-all-pages">Select All</label>
            </PageOption>
        </SignaturePageSelectionHeader>
        <PageSelectionContainer>
            {/* Select All Checkbox */}

            {/* Individual Page Selection */}
            {Array.from({ length: numPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                    <PageOption key={pageNum}>
                        <input
                            type="checkbox"
                            id={`page-${pageNum}`}
                            checked={tempSelectedPages.includes(pageNum)}
                            onChange={() => toggleTempPageSelection(pageNum)}
                        />
                        <label htmlFor={`page-${pageNum}`}>Page {pageNum}</label>
                    </PageOption>
                );
            })}
        </PageSelectionContainer>

        <ButtonsContainer>
            <SignatureButton onClick={handleSubmitSignature}>Save</SignatureButton>
            <SignatureButton onClick={() => setSignatureVisible(false)}>Cancel</SignatureButton>
        </ButtonsContainer>
    </SignatureContainer>
)}

{signatureBoxes.map((box, index) =>
    box.selectedPages.includes(pageNumber) && (
        <Rnd
            key={index}
            size={{
                width: box.pagePositions?.[pageNumber]?.width || box.width, // Use saved size, or fallback to default
                height: box.pagePositions?.[pageNumber]?.height || box.height,
            }}
            position={{
                x: box.pagePositions?.[pageNumber]?.x || box.x, // Use saved position, or fallback to default
                y: box.pagePositions?.[pageNumber]?.y || box.y,
            }}
            onDragStop={(e, d) => updateSignatureBoxPosition(index, pageNumber, d.x, d.y)}
            onResizeStop={(e, direction, ref) =>
                updateSignatureBoxSize(index, pageNumber, ref.offsetWidth, ref.offsetHeight)
            }
            onMouseEnter={() => setHoveredSignatureIndex(index)}
            onMouseLeave={() => setHoveredSignatureIndex(null)}
            enableUserSelectHack={false}
            dragGrid={[1, 1]}
            resizeGrid={[1, 1]}
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
                <EditCard>
                    <EditIcon onClick={() => setDeleteSignatureList(true)}>🗑️</EditIcon>
                    {deleteSignatureList && (
                        <DeleteSignatureList
                            onMouseLeave={() => setDeleteSignatureList(false)}
                        >
                            <SignaturePageSelectionHeader>
                                <h2>Select Pages:</h2>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={isSelectAllChecked(index, selectedDeletePages, box.selectedPages)}
                                        onChange={(e) =>
                                            handleSelectAll(index, e.target.checked, box.selectedPages)
                                        }
                                    />
                                    Select All
                                </label>
                            </SignaturePageSelectionHeader>
                            <PageList>
                                {box.selectedPages.map((page, i) => (
                                    <PageItem key={i}>
                                        <input
                                            type="checkbox"
                                            checked={selectedDeletePages[index]?.includes(page) || false}
                                            onChange={(e) =>
                                                handlePageSelection(index, page, e.target.checked)
                                            }
                                        />
                                        Page {page}
                                    </PageItem>
                                ))}
                            </PageList>
                            {selectedDeletePages[index]?.length > 0 && (
                                <DeleteAllButton
                                    onClick={() =>
                                        deleteSignatureBox(index, selectedDeletePages[index])
                                    }
                                >
                                    Delete Selected Pages
                                </DeleteAllButton>
                            )}
                        </DeleteSignatureList>
                    )}
                </EditCard>
            )}
        </Rnd>
    )
)}

                                {cropMode && pageDimensions && (
                                    <Rnd
                                        style={{
                                            position: 'absolute',
                                            border: '2px dashed blue',
                                            backgroundColor: 'rgba(0, 0, 255, 0.1)',
                                            zIndex: 10,
                                        }}
                                        size={{ width: cropArea.width, height: cropArea.height }}
                                        position={{ x: cropArea.x, y: cropArea.y }}
                                        onDragStop={(e, d) => {
                                            const updatedCropArea = { ...cropArea, x: d.x, y: d.y };
                                            setCropArea(updatedCropArea);
                                            setCroppedArea(updatedCropArea); // Auto-save the crop area
                                        }}
                                        onResizeStop={(e, direction, ref, delta, position) => {
                                            const updatedCropArea = {
                                                width: ref.offsetWidth,
                                                height: ref.offsetHeight,
                                                x: position.x,
                                                y: position.y,
                                            };
                                            setCropArea(updatedCropArea);
                                            setCroppedArea(updatedCropArea); // Auto-save the crop area
                                        }}
                                        bounds="parent"
                                        enableResizing={cropMode}
                                    >
                                        <CloseIcon onClick={handleCropToggle}>
                                            <FaTimes size={16} color="red" />
                                        </CloseIcon>
                                    </Rnd>
                                )}
                                {inputVisible && (
                                    <Rnd
                                        size={{ width: 150, height: 50 }}
                                        position={{ x: newPosition.x, y: newPosition.y }}
                                        onDragStop={(e, d) => setNewPosition({ x: d.x, y: d.y })}
                                        style={{ cursor: 'move', zIndex: hoveredInput === true ? 10 : 4 }}
                                        onMouseEnter={() => setHoveredInput(true)}
                                        onMouseLeave={() => setHoveredInput(false)}
                                    >
                                        <input
                                            type="text"
                                            value={newText}
                                            onChange={handleTextChange}
                                            placeholder="Enter text..."
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                padding: '10px',
                                                border: '1px solid #165277',
                                                outline: 'none',
                                                fontSize: `${fontSize}px`,
                                            }}
                                        />
                                        {hoveredInput !== false && (
                                            <EditCard>
                                                <EditIcon onClick={handleSubmit}>💾</EditIcon>
                                                <EditIcon onClick={() => setFontSize(fontSize + 1)}>A+</EditIcon>
                                                <EditIcon onClick={() => setFontSize(fontSize - 1)}>A-</EditIcon>
                                                <EditIcon onClick={() => setInputVisible(false)}>🗑️</EditIcon>
                                            </EditCard>
                                        )}
                                    </Rnd>
                                )}

                                {textBoxes.map((box, index) => (
                                    <Rnd
                                        key={index}
                                        size={{ width: box.width, height: box.height }}
                                        position={{ x: box.x, y: box.y }}
                                        onDragStop={(e, d) => updateTextBoxPosition(index, d.x, d.y)}
                                        onResizeStop={(e, direction, ref) =>
                                            updateTextBoxSize(index, ref.offsetWidth, ref.offsetHeight)
                                        }
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        style={{ cursor: 'move', zIndex: hoveredIndex === index ? 10 : 4 }}
                                    >
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            {box.isEditing ? (
                                                <input
                                                    type="text"
                                                    value={box.text}
                                                    onChange={(e) => handleTextUpdate(index, e.target.value)}
                                                    onBlur={() => toggleEditing(index, false)}
                                                    autoFocus
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #165277',
                                                        outline: 'none',
                                                        fontSize: `${box.fontSize}px`,
                                                    }}
                                                />
                                            ) : (
                                                <p
                                                    style={{
                                                        fontSize: `${box.fontSize}px`,
                                                        padding: '10px',
                                                        height: '100%',
                                                    }}
                                                    onClick={() => toggleEditing(index, true)}
                                                >
                                                    {box.text}
                                                </p>
                                            )}
                                            {hoveredIndex === index && (
                                                <EditCard>
                                                    <EditIcon onClick={() => setHoveredIndex(false)}>💾</EditIcon>
                                                    <EditIcon onClick={() => changeFontSize(index, 1)}>A+</EditIcon>
                                                    <EditIcon onClick={() => changeFontSize(index, -1)}>A-</EditIcon>
                                                    <EditIcon onClick={() => deleteTextBox(index)}>🗑️</EditIcon>
                                                </EditCard>
                                            )}
                                        </div>
                                    </Rnd>
                                ))}

                                {/* Text Area */}

                                {textAreaVisible && (
                                    <Rnd
                                        size={textAreaSize}
                                        position={{ x: newTextAreaPosition.x, y: newTextAreaPosition.y }}
                                        onDragStop={(e, d) => setNewTextAreaPosition({ x: d.x, y: d.y })}
                                        onResizeStop={(e, direction, ref, delta, position) => {
                                            setNewTextAreaPosition(position);
                                            setTextAreaSize({ width: ref.offsetWidth, height: ref.offsetHeight }); // Update size state
                                        }}
                                        style={{ cursor: 'move', zIndex: hoveredTextArea === true ? 10 : 4 }}
                                        onMouseEnter={() => setHoveredTextArea(true)}
                                        onMouseLeave={() => setHoveredTextArea(false)}
                                    >
                                        <textarea
                                            type="text"
                                            value={newTextAreaText}
                                            onChange={handleTextAreaChange}
                                            placeholder="Enter text..."
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                padding: '10px',
                                                border: '1px solid #165277',
                                                outline: 'none',
                                                fontSize: `${fontSize}px`,
                                            }}
                                        />
                                        {hoveredTextArea !== false && (
                                            <EditCard>
                                                <EditIcon onClick={handleSubmitTextArea}>💾</EditIcon>
                                                <EditIcon onClick={() => setFontSize(fontSize + 1)}>A+</EditIcon>
                                                <EditIcon onClick={() => setFontSize(fontSize - 1)}>A-</EditIcon>
                                                <EditIcon onClick={() => setTextAreaVisible(false)}>🗑️</EditIcon>
                                            </EditCard>
                                        )}
                                    </Rnd>
                                )}

                                {textAreaBoxes.map((box, index) => (
                                    <Rnd
                                        key={index}
                                        size={{ width: box.width, height: box.height }}
                                        position={{ x: box.x, y: box.y }}
                                        onDragStop={(e, d) => updateTextAreaBoxPosition(index, d.x, d.y)}
                                        onResizeStop={(e, direction, ref) =>
                                            updateTextAreaBoxSize(index, ref.offsetWidth, ref.offsetHeight)
                                        }
                                        onMouseEnter={() => setHoveredTextAreaIndex(index)}
                                        onMouseLeave={() => setHoveredTextAreaIndex(null)}
                                        style={{
                                            cursor: 'move',
                                            zIndex: hoveredTextAreaIndex === index ? 10 : 4,
                                            border: hoveredTextAreaIndex === index ? '2px dotted #007BFF' : 'none',
                                        }}
                                    >
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            {box.isEditing ? (
                                                <textarea
                                                    type="text"
                                                    value={box.text}
                                                    onChange={(e) => handleTextAreaUpdate(index, e.target.value)}
                                                    onBlur={() => toggleEditingTextArea(index, false)}
                                                    autoFocus
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #165277',
                                                        outline: 'none',
                                                        fontSize: `${box.fontSize}px`,
                                                    }}
                                                />
                                            ) : (
                                                <p
                                                    style={{
                                                        fontSize: `${box.fontSize}px`,
                                                        padding: '10px',
                                                        height: '100%',
                                                        width: '100%',
                                                        wordWrap: 'break-word',
                                                    }}
                                                    onClick={() => toggleEditingTextArea(index, true)}
                                                >
                                                    {box.text}
                                                </p>
                                            )}
                                            {hoveredTextAreaIndex === index && (
                                                <EditCard>
                                                    <EditIcon onClick={() => setHoveredTextAreaIndex(false)}>💾</EditIcon>
                                                    <EditIcon onClick={() => changeTextAreaFontSize(index, 1)}>A+</EditIcon>
                                                    <EditIcon onClick={() => changeTextAreaFontSize(index, -1)}>A-</EditIcon>
                                                    <EditIcon onClick={() => deleteTextAreaBox(index)}>🗑️</EditIcon>
                                                </EditCard>
                                            )}
                                        </div>
                                    </Rnd>
                                ))}

                                {shapes.map((shape, index) => (
                                    <Rnd
                                        key={index}
                                        bounds="parent"
                                        size={{ width: shape.width, height: shape.height }}
                                        position={{ x: shape.x, y: shape.y }}
                                        onDragStop={(e, d) => {
                                            const updatedShapes = [...shapes];
                                            updatedShapes[index] = { ...updatedShapes[index], x: d.x, y: d.y };
                                            setShapes(updatedShapes);
                                        }}
                                        onResizeStop={(e, direction, ref, delta, position) => {
                                            const updatedShapes = [...shapes];
                                            updatedShapes[index] = {
                                                ...updatedShapes[index],
                                                width: ref.offsetWidth,
                                                height: ref.offsetHeight,
                                                x: position.x,
                                                y: position.y,
                                            };
                                            setShapes(updatedShapes);
                                        }}
                                        onMouseEnter={() => setHoveredShapeIndex(index)}
                                        onMouseLeave={() => setHoveredShapeIndex(null)}
                                        style={{
                                            position: 'absolute',
                                            zIndex: 3,
                                            border: hoveredShapeIndex === index ? '2px dotted #007BFF' : 'none',
                                        }}
                                    >
                                        {/* Shape Render */}
                                        {shape.type === 'circle' && (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: '50%',
                                                    border: shape.border,
                                                    backgroundColor: shape.backgroundColor,
                                                }}
                                            />
                                        )}
                                        {shape.type === 'rectangle' && (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    border: shape.border,
                                                    backgroundColor: shape.backgroundColor,
                                                }}
                                            />
                                        )}
                                        {shape.type === 'highlighter' && (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundColor: 'rgba(255, 255, 0, 0.4)', // Semi-transparent yellow
                                                }}
                                            />
                                        )}
                                        {shape.type === 'tick' && (
                                            <svg width="100%" height="100%" viewBox="0 0 100 100">
                                                <path
                                                    d="M10 50 L40 80 L90 10"
                                                    stroke="#28a745"
                                                    strokeWidth="5"
                                                    fill="none"
                                                />
                                            </svg>
                                        )}
                                        {shape.type === 'cross' && (
                                            <svg width="100%" height="100%" viewBox="0 0 100 100">
                                                <line x1="10" y1="10" x2="90" y2="90" stroke="#d9534f" strokeWidth="5" />
                                                <line x1="90" y1="10" x2="10" y2="90" stroke="#d9534f" strokeWidth="5" />
                                            </svg>
                                        )}
                                        {shape.type === 'polygon' && (
                                            <svg width="100%" height="100%" viewBox="0 0 100 100">
                                                <polygon
                                                    points={shape.points}
                                                    stroke="#000"
                                                    strokeWidth="2"
                                                    fill={shape.backgroundColor}
                                                />
                                            </svg>
                                        )}
                                        {shape.type === 'arrow' && (
                                            <svg width="100%" height="100%" viewBox={`0 0 ${shape.width} ${shape.height}`}>
                                                <line
                                                    x1="0"
                                                    y1={shape.height / 2}
                                                    x2={shape.width - 10}
                                                    y2={shape.height / 2}
                                                    stroke="#000"
                                                    strokeWidth="5"
                                                />
                                                <polygon
                                                    points={`${shape.width - 10},${shape.height / 2 - 5} ${shape.width - 10},${shape.height / 2 + 5} ${shape.width},${shape.height / 2}`}
                                                    fill="#000"
                                                />
                                            </svg>
                                        )}
                                        {shape.type === 'line' && (
                                            <svg width="100%" height="100%" viewBox={`0 0 ${shape.width} ${shape.height}`}>
                                                <line
                                                    x1="0"
                                                    y1={shape.height / 2}
                                                    x2={shape.width}
                                                    y2={shape.height / 2}
                                                    stroke="#000"
                                                    strokeWidth="5"
                                                />
                                            </svg>
                                        )}
                                        {shape.type === 'checkbox' && (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        transform: 'scale(1)',
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {shape.type === 'radio' && (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: '4px',
                                                    border: '2px solid #007BFF',
                                                    borderRadius: '50%',
                                                }}
                                            >
                                                <input
                                                    type="checkbox" // Functionally behave like a checkbox
                                                    checked={shape.isChecked} // Controlled state for checked/unchecked
                                                    onChange={() => {
                                                        const updatedShapes = [...shapes];
                                                        updatedShapes[index].isChecked = !shape.isChecked; // Toggle checked state
                                                        setShapes(updatedShapes);
                                                    }}
                                                    style={{
                                                        appearance: 'none', // Remove default checkbox styling
                                                        width: '100%', // Size proportional to the container
                                                        height: '100%',
                                                        borderRadius: '50%', // Make it round like a radio button
                                                        backgroundColor: shape.isChecked ? '#007BFF' : 'transparent', // Fill color when checked
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Delete Icon */}
                                        {hoveredShapeIndex === index && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: -20,
                                                    right: -20,
                                                    cursor: 'pointer',
                                                    backgroundColor: 'red',
                                                    borderRadius: '50%',
                                                    width: 20,
                                                    height: 20,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: 'white',
                                                    fontSize: 12,
                                                    zIndex: 10,
                                                }}
                                                onClick={() => deleteShape(index)}
                                            >
                                                ✖
                                            </div>
                                        )}
                                    </Rnd>
                                ))}

                                {/* sticky notes  */}
                                {stickyVisible && (
                                    <Rnd
                                        size={stickySize}
                                        position={{ x: newStickyPosition.x, y: newStickyPosition.y }}
                                        onDragStop={(e, d) => setNewStickyPosition({ x: d.x, y: d.y })}
                                        onResizeStop={(e, direction, ref, delta, position) => {
                                            setNewStickyPosition(position);
                                            setStickySize({ width: ref.offsetWidth, height: ref.offsetHeight });
                                        }}
                                        style={{
                                            cursor: 'move',
                                            zIndex: hoveredSticky ? 10 : 4,
                                            background: '#FFEB3B', // Sticky note yellow background
                                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                            borderRadius: '8px',
                                            padding: '10px',
                                        }}
                                        onMouseEnter={() => setHoveredSticky(true)}
                                        onMouseLeave={() => setHoveredSticky(false)}
                                    >
                                        <textarea
                                            value={newStickyText}
                                            onChange={handleStickyChange}
                                            placeholder="Write your note..."
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                background: 'transparent',
                                                border: 'none',
                                                outline: 'none',
                                                fontSize: `${fontSize}px`,
                                                resize: 'none',
                                            }}
                                        />
                                        {hoveredSticky && (
                                            <EditCard>
                                                <EditIcon onClick={handleSubmitSticky}>💾</EditIcon>
                                                <EditIcon onClick={() => setFontSize(fontSize + 1)}>A+</EditIcon>
                                                <EditIcon onClick={() => setFontSize(fontSize - 1)}>A-</EditIcon>
                                                <EditIcon onClick={() => setStickyVisible(false)}>🗑️</EditIcon>
                                            </EditCard>
                                        )}
                                    </Rnd>
                                )}

                                {stickyNotes.map((note, index) => (
                                    <Rnd
                                        key={index}
                                        size={{ width: note.width, height: note.height }}
                                        position={{ x: note.x, y: note.y }}
                                        onDragStop={(e, d) => updateStickyNotePosition(index, d.x, d.y)}
                                        onResizeStop={(e, direction, ref) =>
                                            updateStickyNoteSize(index, ref.offsetWidth, ref.offsetHeight)
                                        }
                                        onMouseEnter={() => setHoveredStickyIndex(index)}
                                        onMouseLeave={() => setHoveredStickyIndex(null)}
                                        style={{
                                            cursor: 'move',
                                            zIndex: hoveredStickyIndex === index ? 10 : 4,
                                            background: '#FFEB3B', // Sticky note yellow background
                                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                            borderRadius: '8px',
                                            padding: '10px',
                                        }}
                                    >
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            {note.isEditing ? (
                                                <textarea
                                                    value={note.text}
                                                    onChange={(e) => handleStickyUpdate(index, e.target.value)}
                                                    onBlur={() => toggleEditingSticky(index, false)}
                                                    autoFocus
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        outline: 'none',
                                                        fontSize: `${note.fontSize}px`,
                                                        resize: 'none',
                                                    }}
                                                />
                                            ) : (
                                                <p
                                                    style={{
                                                        fontSize: `${note.fontSize}px`,
                                                        height: '100%',
                                                        wordWrap: 'break-word',
                                                    }}
                                                    onClick={() => toggleEditingSticky(index, true)}
                                                >
                                                    {note.text}
                                                </p>
                                            )}
                                            {hoveredStickyIndex === index && (
                                                <EditCard>
                                                    <EditIcon onClick={() => toggleEditingSticky(index)}>✏️</EditIcon>
                                                    <EditIcon onClick={() => changeStickyFontSize(index, 1)}>A+</EditIcon>
                                                    <EditIcon onClick={() => changeStickyFontSize(index, -1)}>A-</EditIcon>
                                                    <EditIcon onClick={() => deleteStickyNote(index)}>🗑️</EditIcon>
                                                </EditCard>
                                            )}
                                        </div>
                                    </Rnd>
                                ))}


                                {inputFieldVisible && (
                                    <Rnd
                                        size={inputFieldSize}
                                        position={{ x: newInputFieldPosition.x, y: newInputFieldPosition.y }}
                                        onDragStop={(e, d) => setNewInputFieldPosition({ x: d.x, y: d.y })}
                                        onResizeStop={(e, direction, ref, delta, position) => {
                                            setNewInputFieldPosition(position);
                                            setInputFieldSize({ width: ref.offsetWidth, height: ref.offsetHeight });
                                        }}
                                        style={{ cursor: 'move', zIndex: hoveredInputField === true ? 10 : 4 }}
                                        onMouseEnter={() => setHoveredInputField(true)}
                                        onMouseLeave={() => setHoveredInputField(false)}
                                    >
                                        <input
                                            type="text"
                                            value={newInputFieldText}
                                            onChange={handleInputFieldChange}
                                            placeholder="Enter placeholder..."
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                padding: '10px',
                                                border: '1px solid #165277',
                                                outline: 'none',
                                                fontSize: `${fontSize}px`,
                                            }}
                                        />
                                        {hoveredInputField !== false && (
                                            <EditCard>
                                                <EditIcon onClick={handleSubmitInputField}>💾</EditIcon>
                                                <EditIcon onClick={() => setFontSize(fontSize + 1)}>A+</EditIcon>
                                                <EditIcon onClick={() => setFontSize(fontSize - 1)}>A-</EditIcon>
                                                <EditIcon onClick={() => setInputFieldVisible(false)}>🗑️</EditIcon>
                                            </EditCard>
                                        )}
                                    </Rnd>
                                )}

                                {inputFieldBoxes.map((box, index) => (
                                    <Rnd
                                        key={index}
                                        size={{ width: box.width, height: box.height }}
                                        position={{ x: box.x, y: box.y }}
                                        onDragStop={(e, d) => updateInputFieldBoxPosition(index, d.x, d.y)}
                                        onResizeStop={(e, direction, ref) =>
                                            updateInputFieldBoxSize(index, ref.offsetWidth, ref.offsetHeight)
                                        }
                                        onMouseEnter={() => setHoveredInputFieldIndex(index)}
                                        onMouseLeave={() => setHoveredInputFieldIndex(null)}
                                        style={{
                                            cursor: 'move',
                                            zIndex: hoveredInputFieldIndex === index ? 10 : 4,
                                            border: hoveredInputFieldIndex === index ? '2px dotted #007BFF' : 'none',
                                        }}
                                    >
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            {box.isEditing ? (
                                                <input
                                                    type="text"
                                                    value={box.text}
                                                    onChange={(e) => handleInputFieldUpdate(index, e.target.value)}
                                                    onBlur={() => toggleEditingInputField(index, false)}
                                                    autoFocus
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #165277',
                                                        outline: '#165277',
                                                        fontSize: `${box.fontSize}px`,
                                                    }}
                                                />
                                            ) : (
                                                <p
                                                    style={{
                                                        fontSize: `${box.fontSize}px`,
                                                        padding: '10px',
                                                        height: '100%',
                                                        width: '100%',
                                                        border: '1px solid #165277',
                                                        background: '#fff'
                                                    }}
                                                    onClick={() => toggleEditingInputField(index, true)}
                                                >
                                                    {box.text}
                                                </p>
                                            )}
                                            {hoveredInputFieldIndex === index && (
                                                <EditCard>
                                                    <EditIcon onClick={() => setHoveredInputFieldIndex(false)}>💾</EditIcon>
                                                    <EditIcon onClick={() => changeInputFieldFontSize(index, 1)}>A+</EditIcon>
                                                    <EditIcon onClick={() => changeInputFieldFontSize(index, -1)}>A-</EditIcon>
                                                    <EditIcon onClick={() => deleteInputFieldBox(index)}>🗑️</EditIcon>
                                                </EditCard>
                                            )}
                                        </div>
                                    </Rnd>
                                ))}
                                {selectFieldBoxes.map((box, index) => (
                                    <Rnd
                                        key={index}
                                        size={{ width: box.width, height: box.height }}
                                        position={{ x: box.x, y: box.y }}
                                        onDragStop={(e, d) => updateSelectFieldBoxPosition(index, d.x, d.y)}
                                        onResizeStop={(e, direction, ref) =>
                                            updateSelectFieldBoxSize(index, ref.offsetWidth, ref.offsetHeight)
                                        }
                                        onMouseEnter={() => setHoveredSelectFieldIndex(index)}
                                        onMouseLeave={() => {
                                            setHoveredSelectFieldIndex(null);
                                            setEditSelectFieldIndex(false);
                                        }}
                                        style={{
                                            cursor: 'move',
                                            zIndex: hoveredSelectFieldIndex === index ? 10 : 4,
                                            border: hoveredSelectFieldIndex === index ? '2px dotted #007BFF' : 'none',
                                        }}
                                    >
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <select
                                                value={box.value}
                                                onChange={(e) => handleSelectFieldChange(index, e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #165277',
                                                    outline: 'none',
                                                    fontSize: `${box.fontSize || 16}px`, // Default font size to 16px
                                                }}
                                            >
                                                {box.options.map((option, optIdx) => (
                                                    <option key={optIdx} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                            {editSelectFieldIndex === index && (
                                                <EditSelectCard>
                                                    {/* Add New Option */}
                                                    <EditSelectCardOption>
                                                        <input
                                                            type="text"
                                                            value={newOption}
                                                            onChange={(e) => setNewOption(e.target.value)}
                                                            placeholder="Add new option"
                                                        />
                                                        <button onClick={() => addOptionToSelectField(index)}>➕</button>
                                                    </EditSelectCardOption>

                                                    {/* Edit Existing Options */}
                                                    {box.options.map((option, optIdx) => (
                                                        <EditSelectCardOption key={optIdx}>
                                                            {editingOption.index === index && editingOption.optIdx === optIdx ? (
                                                                <>
                                                                    <input
                                                                        type="text"
                                                                        value={editingOption.value}
                                                                        onChange={(e) =>
                                                                            setEditingOption((prev) => ({
                                                                                ...prev,
                                                                                value: e.target.value,
                                                                            }))
                                                                        }
                                                                    />
                                                                    <button onClick={saveEditedOption}>💾</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span
                                                                        style={{ cursor: 'pointer', flexGrow: 1 }}
                                                                        onClick={() => startEditingOption(index, optIdx, option)}
                                                                    >
                                                                        {option}
                                                                    </span>
                                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                                        <button
                                                                            onClick={() => startEditingOption(index, optIdx, option)}
                                                                            title="Edit"
                                                                        >
                                                                            ✏️
                                                                        </button>
                                                                        <button
                                                                            onClick={() => removeOptionFromSelectField(index, optIdx)}
                                                                            title="Delete"
                                                                        >
                                                                            🗑️
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </EditSelectCardOption>
                                                    ))}
                                                </EditSelectCard>
                                            )}
                                        </div>
                                        {hoveredSelectFieldIndex === index && (
                                            <EditCard>
                                                <EditIcon onClick={() => setEditSelectFieldIndex(index)}>✏️</EditIcon>
                                                <EditIcon onClick={() => setHoveredSelectFieldIndex(false)}>💾</EditIcon>
                                                <EditIcon onClick={() => changeFontSizeSelect(index, 1)}>A+</EditIcon>
                                                <EditIcon onClick={() => changeFontSizeSelect(index, -1)}>A-</EditIcon>
                                                <EditIcon onClick={() => deleteSelectFieldBox(index)}>🗑️</EditIcon>
                                            </EditCard>
                                        )}
                                    </Rnd>
                                ))}


                                {datePickerVisible && (
                                    <Rnd
                                        size={dateBoxSize}
                                        position={{ x: newDatePosition.x, y: newDatePosition.y }}
                                        onDragStop={(e, d) => setNewDatePosition({ x: d.x, y: d.y })}
                                        onResizeStop={(e, direction, ref, delta, position) => {
                                            setNewDatePosition(position);
                                            setDateBoxSize({ width: ref.offsetWidth, height: ref.offsetHeight });
                                        }}
                                        style={{ cursor: 'move', zIndex: hoveredDate === true ? 10 : 4 }}
                                        onMouseEnter={() => setHoveredDate(true)}
                                        onMouseLeave={() => setHoveredDate(false)}
                                    >
                                        <input
                                            type="date"
                                            value={newDateValue}
                                            onChange={handleDateChange}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                padding: '10px',
                                                border: '1px solid #165277',
                                                outline: 'none',
                                                fontSize: `${fontSize}px`,
                                            }}
                                        />
                                        {hoveredDate && (
                                            <EditCard>
                                                <EditIcon onClick={handleSubmitDate}>💾</EditIcon>
                                                <EditIcon onClick={() => setFontSize(fontSize + 1)}>A+</EditIcon>
                                                <EditIcon onClick={() => setFontSize(fontSize - 1)}>A-</EditIcon>
                                                <EditIcon onClick={() => setDatePickerVisible(false)}>🗑️</EditIcon>
                                            </EditCard>
                                        )}
                                    </Rnd>
                                )}

                                {dateBoxes.map((box, index) => (
                                    <Rnd
                                        key={index}
                                        size={{ width: box.width, height: box.height }}
                                        position={{ x: box.x, y: box.y }}
                                        onDragStop={(e, d) => updateDateBoxPosition(index, d.x, d.y)}
                                        onResizeStop={(e, direction, ref) =>
                                            updateDateBoxSize(index, ref.offsetWidth, ref.offsetHeight)
                                        }
                                        onMouseEnter={() => setHoveredDateIndex(index)}
                                        onMouseLeave={() => setHoveredDateIndex(null)}
                                        style={{
                                            cursor: 'move',
                                            zIndex: hoveredDateIndex === index ? 10 : 4,
                                            border: hoveredDateIndex === index ? '2px dotted #007BFF' : 'none',
                                        }}
                                    >
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            {box.isEditing ? (
                                                <input
                                                    type="date"
                                                    value={box.date}
                                                    onChange={(e) => handleDateUpdate(index, e.target.value)}
                                                    onBlur={() => toggleEditingDateBox(index, false)}
                                                    autoFocus
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        padding: '10px',
                                                        border: '1px solid #165277',
                                                        outline: 'none',
                                                        fontSize: `${box.fontSize || 16}px`,
                                                    }}
                                                />
                                            ) : (
                                                <p
                                                    style={{
                                                        padding: '10px',
                                                        height: '100%',
                                                        width: '100%',
                                                        wordWrap: 'break-word',
                                                        fontSize: `${box.fontSize || 16}px`,
                                                    }}
                                                    onClick={() => toggleEditingDateBox(index, true)}
                                                >
                                                    {box.date}
                                                </p>
                                            )}
                                            {hoveredDateIndex === index && (
                                                <EditCard>
                                                    <EditIcon onClick={() => toggleEditingDateBox(index, false)}>💾</EditIcon>
                                                    <EditIcon onClick={() => changeFontSizeDate(index, 1)}>A+</EditIcon>
                                                    <EditIcon onClick={() => changeFontSizeDate(index, -1)}>A-</EditIcon>
                                                    <EditIcon onClick={() => deleteDateBox(index)}>🗑️</EditIcon>
                                                </EditCard>
                                            )}
                                        </div>
                                    </Rnd>
                                ))}


                                {rectangleStyles.map((rect, index) => (
                                    <>
                                        <Rnd
                                            key={index}
                                            style={{
                                                position: 'absolute',
                                                border: `3px solid ${BackgroundColor}`,
                                                backgroundColor: BackgroundColor,
                                                pointerEvents: 'auto',
                                                zIndex: 2,
                                            }}
                                            bounds="parent"
                                            size={{ width: rect.width, height: rect.height }}
                                            position={{ x: rect.x, y: rect.y }}
                                            onResizeStop={(e, direction, ref, delta, position) => {
                                                const newWidth = ref.offsetWidth;
                                                const newHeight = ref.offsetHeight;

                                                setRectanglePosition((prev) => prev.map((r, idx) =>
                                                    idx === index
                                                        ? {
                                                            ...r,
                                                            width: newWidth > pageDimensions.width ? pageDimensions.width : newWidth,
                                                            height: newHeight > pageDimensions.height ? pageDimensions.height : newHeight,
                                                            x: position.x < 0 ? 0 : position.x,
                                                            y: position.y < 0 ? 0 : position.y,
                                                        }
                                                        : r
                                                ));

                                                // Update percentage based on new dimensions
                                                if (pageDimensions) {
                                                    const newWidthPercentage = (newWidth / pageDimensions.width) * 100;
                                                    const newHeightPercentage = (newHeight / pageDimensions.height) * 100;

                                                    // Update rectangle percentage frame for the specific rectangle
                                                    setRectanglePercentage((prev) => ({
                                                        width: newWidthPercentage,
                                                        height: newHeightPercentage,
                                                    }));

                                                    // Update the percentage frame for all rectangles
                                                    setRectanglePercentageFrame((prevFrame) => {
                                                        const updatedFrame = [...prevFrame];
                                                        updatedFrame[index] = {
                                                            width: newWidthPercentage,
                                                            height: newHeightPercentage,
                                                        };
                                                        return updatedFrame;
                                                    });
                                                }
                                            }}
                                        >
                                            <PercentageCard>
                                                {selectedOption === 'frame' && index === 0 && <div>Header: W: {Math.round(rectanglePercentageFrame[0]?.width)}% H: {Math.round(rectanglePercentageFrame[0]?.height)}%</div>}
                                                {selectedOption === 'frame' && index === 1 && <div>LeftSide: W: {Math.round(rectanglePercentageFrame[1]?.width)}% H: {Math.round(rectanglePercentageFrame[1]?.height)}%</div>}
                                                {selectedOption === 'frame' && index === 2 && <div>RightSide: W: {Math.round(rectanglePercentageFrame[2]?.width)}% H: {Math.round(rectanglePercentageFrame[2]?.height)}%</div>}
                                                {selectedOption === 'frame' && index === 3 && <div>Footer: W: {Math.round(rectanglePercentageFrame[3]?.width)}% H: {Math.round(rectanglePercentageFrame[3]?.height)}%</div>}
                                                {selectedOption !== 'frame' && (
                                                    <>
                                                        <div>W: {Math.round(rectanglePercentage.width)}%</div>
                                                        <div>H: {Math.round(rectanglePercentage.height)}%</div>
                                                    </>
                                                )}
                                            </PercentageCard>
                                            {selectedOption !== 'frame' && (
                                                <CloseIcon
                                                    onClick={() => {
                                                        setRectanglePosition([]);
                                                        setSelectedOption('');
                                                    }}
                                                >
                                                    <FaTimes size={16} color="red" />
                                                </CloseIcon>
                                            )}
                                        </Rnd>
                                        {selectedOption == 'frame' && (
                                            <CloseIcon
                                                onClick={() => {
                                                    setRectanglePosition([]);
                                                    setSelectedOption('');
                                                }}
                                            >
                                                <FaTimes size={16} color="red" />
                                            </CloseIcon>
                                        )}
                                    </>
                                ))}

                                {imageBoxVisible && (
                                    <Rnd
                                        size={imageBoxSize}
                                        position={{ x: newImagePosition.x, y: newImagePosition.y }}
                                        onDragStop={(e, d) => setNewImagePosition({ x: d.x, y: d.y })}
                                        onResizeStop={(e, direction, ref, delta, position) => {
                                            setNewImagePosition(position);
                                            setImageBoxSize({ width: ref.offsetWidth, height: ref.offsetHeight });
                                        }}
                                        style={{ cursor: 'move', zIndex: 10 }}
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                border: '1px solid #165277',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#f0f0f0',
                                            }}
                                        >
                                            {newImage ? (
                                                <img
                                                    src={newImage}
                                                    alt="Selected"
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <label
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <FaUpload style={{ fontSize: '20px', marginBottom: '5px' }} />
                                                    <span>Choose Image</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                            )}
                                            <EditCard>
                                                <EditIcon onClick={handleSubmitImageBox}>💾</EditIcon>
                                                <EditIcon onClick={() => { setImageBoxVisible(false); setNewImage(false); }}>🗑️</EditIcon>
                                            </EditCard>
                                        </div>
                                    </Rnd>
                                )}

                                {imageBoxes.map((box, index) => (
                                    <Rnd
                                        key={index}
                                        size={{ width: box.width, height: box.height }}
                                        position={{ x: box.x, y: box.y }}
                                        onDragStop={(e, d) => updateImageBoxPosition(index, d.x, d.y)}
                                        onResizeStop={(e, direction, ref) =>
                                            updateImageBoxSize(index, ref.offsetWidth, ref.offsetHeight)
                                        }
                                        onMouseEnter={() => setHoveredImageBoxIndex(index)}
                                        onMouseLeave={() => setHoveredImageBoxIndex(null)}
                                        style={{
                                            cursor: 'move',
                                            zIndex: hoveredImageBoxIndex === index ? 10 : 4,
                                            border: hoveredImageBoxIndex === index ? '2px dotted #007BFF' : 'none',
                                        }}
                                    >
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <img
                                                src={box.image}
                                                alt="Box"
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                            {hoveredImageBoxIndex === index && (
                                                <EditCard>
                                                    <EditIcon onClick={() => deleteImageBox(index)}>🗑️</EditIcon>
                                                </EditCard>
                                            )}
                                        </div>
                                    </Rnd>
                                ))}
                                <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                                    <TableBoxManager tableVisible={tableVisible} setTableVisible={setTableVisible} />
                                </div>

                            </PDFContainer>
                        </PDFContainerSection>
                        <SidebarOptions
                            uploadedFileURL={uploadedFileURL}
                            selectedOption={selectedOption}
                            onOptionChange={handleOptionChange}
                            onBrightnessChange={handleBrightnessChange}
                            onContrastChange={handleContrastChange}
                            addTextBox={addTextBox}
                            setCropMode={setCropMode}
                            addSignatureBox={addSignatureBox}
                            addShape={addShape}
                            addTextAreaBox={addTextAreaBox}
                            addStickyNote={addStickyNote}
                            addInputFieldBox={addInputFieldBox}
                            addSelectFieldBox={addSelectFieldBox}
                            addDateBox={addDateBox}
                            addImageBox={addImageBox}
                            setTableVisible={setTableVisible}
                            handleWaterMarkChange={handleWaterMarkChange}
                            waterMarkVisible={waterMarkVisible}
                            setWaterMarkVisible={setWaterMarkVisible}
                        />
                    </PDFViewerWrapper>
                </>
            ) : (
                <FileInputButton>
                    {/* <LogoContainer>
                        <img src={logo} alt='logo' />
                    </LogoContainer> */}
                    <h2>Upload PDF file you want to clean</h2>
                    <FileInput ref={fileInputRef} type="file" onChange={handleFileChange} accept="application/pdf" />
                    <FileButton onClick={() => fileInputRef.current.click()} disabled={isLoading}>
                        {isLoading ? "Uploading..." : "Choose PDF File"}
                    </FileButton>
                    {!isLoading && file && (
                        <>
                            <FileInfoHome>
                                Selected File: {fileName ? <span>{fileName}</span> : 'None'}
                            </FileInfoHome>
                            <IconButton disabled={isLoading} onClick={() => setFileView(true)}>
                                Preview PDF
                                <FaToggleOff size={40} color="#165277" cursor="pointer" />
                            </IconButton>
                        </>
                    )}
                    {/* <DropdownOptions uploadedFileURL={uploadedFileURL} selectedOption={selectedOption} onOptionChange={handleOptionChange} /> */}
                </FileInputButton>
            )}
        </>
    );
};

export default PDFViewer;


const PercentageCard = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid #165277;
    border-radius: 8px;
    padding: 5px;
    z-index: 10;
    width: 55px;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: center;
    margin: auto;
    font-size: 10px;
`;


const PDFViewerWrapper = styled.div`
    display: flex;
    gap: 20px;
    justify-content: center;
    padding: 0 30px 30px 30px;
    position: relative;
    width: 100%;
    height: 100%;
    max-height: 1200px;
`;

const PDFContainerSection = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f9f9f9;
    padding: 20px;
    width: 100%;
    overflow: auto;
`;

const PDFContainer = styled.div`
    position: relative; /* Container for PDF and overlay */
    display: flex;
    justify-content: center;
    align-items: center;
`;
const RectangleInputs = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    background: white;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    z-index: 2000;
`;

const Nav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 20px;
    
    @media screen and (max-width: 768px) {
        flex-direction: column;
        text-align: center;
    }
`;

const EditIcon = styled.button`
    background-color: #165277;
    color: #fff;
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    height: 30px;
`;

const EditCard = styled.button`
position: absolute;
top: -55px;
left: 0;
right: 0;
background: #fff;
border: none;
padding: 10px;
display: flex;
justify-content: flex-end;
gap: 8px;
z-index: 10;
height: 50px;
`;

const EditSelectCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fff;
  width: 100%;
  border: 1px solid #ddd;
  padding: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const DeleteSignatureList = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: #fff;
    border: 1px solid #165277;
    padding: 10px;
`;

const PageList = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
`;

const PageItem = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const DeleteSelectAllButton = styled.button`
    border: 1px solid #165277;
    background-color: #fff;
    color: #165277;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    width: 100px;
`;

const DeleteAllButton = styled.button`
    margin-top: 8px;
    background-color: #ff4747;
    color: white;
    padding: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    &:hover {
        background-color: #e63946;
    }
`;

const EditSelectCardOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 10px;

  input {
    border: 1px solid #165277;
    border-radius: 4px;
    width: 70%;
    height: 35px;
    padding: 5px 10px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s ease;
  }

  input:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 12px;
    color: #007bff;
    border: 1px solid #165277;
    border-radius: 4px;
    height: 35px;
    padding: 5px;
    transition: border-color 0.2s ease;
  }

  button:hover {
    color: #0056b3;
  }
`;


const PageInfo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #165277;
    margin: 10px 0;
    border: 2px solid #165277;
    background: #fff;
    padding: 10px 20px;
    border-radius: 50px;
    position: fixed;
    bottom: 0;
    z-index: 10;
    @media screen and (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }
`;

const PageInfoButton = styled.button`
    background-color: #165277;
    color: #fff;
    border: none;
    padding: 6px 12px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:disabled {
        background-color: #d3d3d3;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background-color: #165277;
    }
`;

const PageInfoButtons = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
`;

const FileInfoHome = styled.div`
    margin-right: 20px;
    font-size: 16px;
    font-weight: 500;
    color: #165277;
    display: flex;
    align-items: center;

    span {
        font-weight: bold;
        margin-left: 5px;
    }
    
    @media screen and (max-width: 768px) {
        flex-direction: column;
        text-align: center;
    }
`;

const FileInfo = styled.div`
    margin-right: 20px;
    font-size: 16px;
    font-weight: 500;
    color: #165277;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    span {
        font-weight: bold;
        margin-left: 5px;
    }
    
    @media screen and (max-width: 768px) {
        flex-direction: column;
        text-align: center;
    }
`;

const FileInputButton = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 10px;
    padding: 150px 20px 20px 20px;

    h2 {
        color: #165277;
        text-align: center;
        width: 100%;
    }
    
    @media screen and (max-width: 768px) {
        h2 {
            font-size: 20px;
        }
    }
`;

const FileInput = styled.input`
    display: none;
`;

const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 300px;
`;

const FileButton = styled.button`
    padding: 15px 40px;
    background-color: #165277;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #165277;
    }
    
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const IconButton = styled.button`
    background: none;
    border: none;
    border-radius: 4px;
    margin: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #165277;
    font-size: 16px;
    font-weight: bold;
`;
const CloseIcon = styled.div`
    position: absolute;
    top: -10px;
    right: -10px;
    cursor: pointer;
    background-color: white;
    border-radius: 50%;
    padding: 4px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    z-index: 4;
`;
const TextBox = styled.div`
    border-radius: 4px;
    word-wrap: break-word;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100px;
    height: 40px;
    padding: 10px;
`;
const Sidebar = styled.div`
    width: 300px;
    overflow-y: auto; /* Enable vertical scrolling */
    background: #f4f4f4;
    border: 1px solid #165277;
    padding: 10px;
    max-height: 100%;

    /* Add a scrollbar style (optional) */
    &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background-color: #999;
    }
`;


const ThumbnailList = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
`;
const ThumbnailItem = styled.div`
    position: relative;
    border: ${(props) => (props.isSelected ? '2px solid #165277' : '1px solid #ddd')};
    cursor: pointer;
    padding: 5px;
    background: white;
    box-shadow: ${(props) =>
        props.isSelected ? '0 0 5px #0073e6' : '0 0 3px rgba(0,0,0,0.1)'};
    &:hover {
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
        border: 2px solid #165277;
    }
    width: 150px;
    height: 200px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PageNumberBadge = styled.div`
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: #165277;
    color: white;
    font-size: 12px;
    font-weight: bold;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    display: ${(props) => (props.isSelected ? 'flex' : 'none')};;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;
const Watermark = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.2;

  img {
    max-width: 100%;
    max-height: 100%;
    pointer-events: none; /* Makes the watermark unclickable */
  }
`;

const SignatureContainer = styled.div`
  position: absolute;
  z-index: 10;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  max-width: 700px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PageSelectionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SignaturePageSelectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  
  h2{
        color: #165277;
        font-size: 18px;
        text-align: left;
    }

    label{
        color: #165277;
        font-size: 16px;
        font-weight: bold;
        input{
        transform: scale(1.3);
        cursor: pointer;
        margin-right: 5px;
        }
    }
        input{
        transform: scale(1.3);
        cursor: pointer;
        margin-right: 5px;
        }
`;

const PageOption = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
`;

const SignatureButton = styled.button`
  background-color: #165277;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #113b58;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;