import { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import styled from 'styled-components';
import 'react-pdf/dist/Page/TextLayer.css'; // Text layer for React-PDF
import DropdownOptions from './DropdownOptions';
import { Rnd } from 'react-rnd';

// Importing the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const PDFViewer = () => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [rectanglePosition, setRectanglePosition] = useState(null);
    const [pageDimensions, setPageDimensions] = useState(null); 
    const fileInputRef = useRef(null);

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
      if (windowWidth <= 1400) {
          setScale(0.39); // Mobile
      } else if (windowWidth <= 900) {
          setScale(0.75); // Tablet
      } else {
          setScale(0.5); // Desktop
      }
  };

    useEffect(() => {
        calculateScale(); // Initial calculation
        window.addEventListener('resize', calculateScale); // Update scale on resize
        return () => {
            window.removeEventListener('resize', calculateScale); // Cleanup on unmount
        };
    }, []);

    const handleFileChange = (event) => {
        const chosenFile = event.target.files[0];
        if (chosenFile) {
            setFile(URL.createObjectURL(chosenFile));
            setFileName(chosenFile.name);
        }
    };

    const handleOptionChange = (selected) => {
        setRectanglePosition(getRectangleStyle(selected)); // Set rectangle position
    };

    const getRectangleStyle = (position) => {
        if (!pageDimensions) return {}; // Return empty object if pageDimensions are not available

        const { width, height } = pageDimensions;

        switch (position) {
            case 'Top':
                return {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height * 0.2,
                };
            case 'Left':
                return {
                    x: 0,
                    y: 0,
                    width: width * 0.2,
                    height: height,
                };
            case 'Right':
                return {
                    x: width * 0.8,
                    y: 0,
                    width: width * 0.2,
                    height: height,
                };
            case 'Bottom':
                return {
                    x: 0,
                    y: height * 0.8,
                    width: width,
                    height: height * 0.2,
                };
            default:
                return {};
        }
    };

    return (
        <>
            {file ? (
                <PDFViewerWrapper>
                    <Nav>
                        <FileInfo>
                            Selected File: {fileName ? <span>{fileName}</span> : 'None'}
                        </FileInfo>
                        <DropdownOptions onOptionChange={handleOptionChange} />
                    </Nav>

                    <PageInfo>
                        <Button onClick={goToPrevPage} disabled={pageNumber <= 1}>
                            Prev
                        </Button>
                        <h2>
                            {pageNumber} / {numPages}
                        </h2>
                        <Button onClick={goToNextPage} disabled={pageNumber >= numPages}>
                            Next
                        </Button>
                    </PageInfo>

                    <PDFContainer>
                        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page 
                                scale={scale} 
                                pageNumber={pageNumber} 
                                onRenderSuccess={onPageRenderSuccess} 
                            />
                        </Document>
                        {rectanglePosition && (
                            <Rnd
                                style={{
                                    position: 'absolute',
                                    border: '3px solid red',
                                    backgroundColor: 'rgba(255, 0, 0, 0.3)', // Semi-transparent red background
                                    pointerEvents: 'auto', // Allow pointer events for dragging and resizing
                                }}
                                bounds="parent" // Restrict dragging to the parent container
                                size={{ width: rectanglePosition.width, height: rectanglePosition.height }} // Set size based on position
                                position={{ x: rectanglePosition.x, y: rectanglePosition.y }} // Default position
                                onDragStop={(e, d) => {
                                    // Update rectangle position after dragging
                                    setRectanglePosition((prev) => ({
                                        ...prev,
                                        x: d.x,
                                        y: d.y,
                                    }));
                                }}
                                onResizeStop={(e, direction, ref, delta, position) => {
                                    // Update rectangle size and position after resizing
                                    const newWidth = ref.offsetWidth; // Correctly fetch new width
                                    const newHeight = ref.offsetHeight; // Correctly fetch new height
                                    setRectanglePosition((prev) => ({
                                        ...prev,
                                        width: newWidth,
                                        height: newHeight,
                                        x: position.x, // Maintain updated position
                                        y: position.y, // Maintain updated position
                                    }));
                                }}
                                enableResizing={{
                                    top: true,
                                    right: true,
                                    bottom: true,
                                    left: true,
                                    topRight: true,
                                    bottomRight: true,
                                    bottomLeft: true,
                                    topLeft: true,
                                }}
                            />
                        )}
                    </PDFContainer>
                </PDFViewerWrapper>
            ) : (
                <FileInputButton>
                    <h2>Upload PDF file you want to clean</h2>
                    <FileInput ref={fileInputRef} type="file" onChange={handleFileChange} accept="application/pdf" />
                    <FileButton onClick={() => fileInputRef.current.click()}>Choose PDF File</FileButton>
                </FileInputButton>
            )}
        </>
    );
};

export default PDFViewer;

// Styled components
const PDFViewerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    margin-top: 30px;
    position: relative;
`;

const PDFContainer = styled.div`
    position: relative; /* Container for PDF and overlay */
    display: flex;
    justify-content: center; /* Horizontally center */
    align-items: center; /* Vertically center */
`;

const Nav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
`;

const Button = styled.button`
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 8px 16px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:disabled {
        background-color: #d3d3d3;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background-color: #0056b3;
    }
`;

const FileInfo = styled.div`
    margin-right: 20px;
    font-size: 16px;
    font-weight: 500;
    color: #1976d2;

    span {
        font-weight: bold;
    }
`;

const PageInfo = styled.p`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #1976d2;
`;

const FileInputButton = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;

    h2 {
        color: #1976d2;
        text-align: center;
        width: 100%;
    }
`;

const FileInput = styled.input`
    display: none;
`;

const FileButton = styled.button`
    padding: 15px 40px;
    background-color: #007bff;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;




// import { useState, useRef, useEffect } from 'react';
// import { Document, Page } from 'react-pdf';
// import { pdfjs } from 'react-pdf';
// import styled from 'styled-components';
// import 'react-pdf/dist/Page/TextLayer.css'; // Text layer for React-PDF
// import DropdownOptions from './DropdownOptions';
// import { FaToggleOff } from "react-icons/fa6";
// import { IoMdArrowRoundBack } from "react-icons/io";
// import logo from '../assets/logo.jpeg';
// import { uploadDocument } from '../APIS/UploadDocument';

// // Importing the PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.mjs',
//     import.meta.url,
// ).toString();

// const PDFViewer = () => {
//     const [numPages, setNumPages] = useState(null);
//     const [pageNumber, setPageNumber] = useState(1);
//     const [scale, setScale] = useState(1);
//     const [file, setFile] = useState(null);
//     const [uploadedFileURL, setUploadedFileURL] = useState(null);
//     const [fileView, setFileView] = useState(false);
//     const [fileName, setFileName] = useState('');
//     const [selectedOption, setSelectedOption] = useState(''); // State for dropdown selection
//     const fileInputRef = useRef(null); // Reference for file input
//     const [isLoading, setIsLoading] = useState(false);

//     const onDocumentLoadSuccess = ({ numPages }) => {
//         setNumPages(numPages);
//     };

//     const goToPrevPage = () => setPageNumber((prevPage) => (prevPage - 1 <= 1 ? 1 : prevPage - 1));

//     const goToNextPage = () => setPageNumber((prevPage) => (prevPage + 1 >= numPages ? numPages : prevPage + 1));

//     const calculateScale = () => {
//         const windowWidth = window.innerWidth;
//         if (windowWidth >= 1200) {
//             setScale(1);
//         } else if (windowWidth >= 900) {
//             setScale(0.75);
//         } else {
//             setScale(0.4);
//         }
//     };

//     const increaseScale = () => setScale((prevScale) => Math.min(prevScale + 0.1, 2));
//     const decreaseScale = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.1));

//     useEffect(() => {
//         calculateScale(); // Initial calculation
//         window.addEventListener('resize', calculateScale); // Update scale on resize
//         return () => {
//             window.removeEventListener('resize', calculateScale); // Cleanup on unmount
//         };
//     }, []);

//     const handleFileChange = (event) => {
//         const chosenFile = event.target.files[0];
//         if (chosenFile) {
//             setFile(URL.createObjectURL(chosenFile));
//             setFileName(chosenFile.name);
//         }
//         // if (chosenFile) {
//         //     setIsLoading(true); // Start loading state
//         //     uploadDocument({ file: chosenFile })
//         //         .then((resp) => {
//         //             setUploadedFileURL(resp?.file);
//         //             setFile(URL.createObjectURL(chosenFile));
//         //             setFileName(chosenFile.name);
//         //         })
//         //         .catch((err) => {
//         //             console.log('Upload error:', err);
//         //         })
//         //         .finally(() => {
//         //             setIsLoading(false); // End loading state
//         //         });
//         // }
//     };

//     const handleOptionChange = (option) => {
//         setSelectedOption(option); // Update the selected option in the parent component
//     };

//     return (
//         <>
//             {fileView ? (
//                 <PDFViewerWrapper>
//                     <Nav>
//                         <FileInfo>
//                             <IconButton onClick={() => setFileView(false)}>
//                                 <IoMdArrowRoundBack size={28} color="#165277" />
//                             </IconButton>
//                             <p>Selected File: {fileName ? <span>{fileName}</span> : 'None'}</p>
//                         </FileInfo>
//                         <DropdownOptions uploadedFileURL={uploadedFileURL} selectedOption={selectedOption} onOptionChange={handleOptionChange} />
//                     </Nav>

//                     <PageInfo>
//                         <PageInfoButton>
//                         <Button onClick={goToPrevPage} disabled={pageNumber <= 1}>
//                             Prev
//                         </Button>
//                         <h2>
//                             {pageNumber} / {numPages}
//                         </h2>
//                         <Button onClick={goToNextPage} disabled={pageNumber >= numPages}>
//                             Next
//                         </Button>
//                         </PageInfoButton>
//                         <PageInfoButton>
//                         <Button onClick={decreaseScale}>-</Button>
//                         <ScaleDisplay>{Math.round(scale * 100)}%</ScaleDisplay>
//                         <Button onClick={increaseScale}>+</Button>
//                         </PageInfoButton>
//                     </PageInfo>

//                     <PDFContainer>
//                         <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
//                             <Page scale={scale} pageNumber={pageNumber} />
//                         </Document>
//                     </PDFContainer>
//                 </PDFViewerWrapper>
//             ) : (
//                 <FileInputButton>
//                     {/* <LogoContainer>
//                         <img src={logo} alt='logo' />
//                     </LogoContainer> */}
//                     <h2>Upload PDF file you want to clean</h2>
//                     <FileInput ref={fileInputRef} type="file" onChange={handleFileChange} accept="application/pdf" />
//                     <FileButton onClick={() => fileInputRef.current.click()} disabled={isLoading}>
//                         {isLoading ? "Uploading..." : "Choose PDF File"}
//                     </FileButton>
//                     {!isLoading && file && (
//                         <>
//                             <FileInfoHome>
//                                 Selected File: {fileName ? <span>{fileName}</span> : 'None'}
//                             </FileInfoHome>
//                             <IconButton disabled={isLoading} onClick={() => setFileView(true)}>
//                                 Preview PDF
//                                 <FaToggleOff size={40} color="#165277" cursor="pointer" />
//                             </IconButton>
//                         </>
//                     )}
//                     <DropdownOptions uploadedFileURL={uploadedFileURL} selectedOption={selectedOption} onOptionChange={handleOptionChange} />
//                 </FileInputButton>
//             )}
//         </>
//     );
// };

// export default PDFViewer;

// const PDFViewerWrapper = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     padding: 0 30px;
//     position: relative;
//     height: 100vh;
//     min-height: 100vh;
// `;

// const PDFContainer = styled.div`
//     position: relative;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     border: 1px solid #e0e0e0;
//     border-radius: 8px;
//     background-color: #f9f9f9;
//     margin-top: 20px;
//     padding: 20px;
//     width: 100%;
//     overflow: auto;
// `;

// const Nav = styled.nav`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     width: 100%;
//     margin-bottom: 10px;
    
//     @media screen and (max-width: 768px) {
//         flex-direction: column;
//         text-align: center;
//     }
// `;

// const Button = styled.button`
//     background-color: #165277;
//     color: #fff;
//     border: none;
//     padding: 8px 16px;
//     margin: 0 5px;
//     cursor: pointer;
//     border-radius: 4px;
//     transition: background-color 0.3s ease;

//     &:disabled {
//         background-color: #d3d3d3;
//         cursor: not-allowed;
//     }

//     &:hover:not(:disabled) {
//         background-color: #165277;
//     }
// `;

// const ScaleDisplay = styled.div`
//     font-size: 18px;
//     font-weight: bold;
//     color: #165277;
//     margin: 0 10px;
// `;

// const PageInfo = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     gap: 10px;
//     color: #165277;
//     margin: 10px 0;
//     @media screen and (max-width: 768px) {
//         flex-direction: column;
//         text-align: center;
//         gap: 20px;
//     }
// `;

// const PageInfoButton= styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     gap: 5px;
// `;

// const FileInfoHome = styled.div`
//     margin-right: 20px;
//     font-size: 16px;
//     font-weight: 500;
//     color: #165277;
//     display: flex;
//     align-items: center;

//     span {
//         font-weight: bold;
//         margin-left: 5px;
//     }
    
//     @media screen and (max-width: 768px) {
//         flex-direction: column;
//         text-align: center;
//     }
// `;

// const FileInfo = styled.div`
//     margin-right: 20px;
//     font-size: 16px;
//     font-weight: 500;
//     color: #165277;
//     display: flex;
//     align-items: center;
//     flex-wrap: wrap;

//     span {
//         font-weight: bold;
//         margin-left: 5px;
//     }
    
//     @media screen and (max-width: 768px) {
//         flex-direction: column;
//         text-align: center;
//     }
// `;

// const FileInputButton = styled.div`
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     width: 100%;
//     height: 100%;
//     gap: 10px;
//     padding: 150px 20px 20px 20px;

//     h2 {
//         color: #165277;
//         text-align: center;
//         width: 100%;
//     }
    
//     @media screen and (max-width: 768px) {
//         h2 {
//             font-size: 20px;
//         }
//     }
// `;

// const FileInput = styled.input`
//     display: none;
// `;

// const LogoContainer = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 300px;
//     height: 300px;
// `;

// const FileButton = styled.button`
//     padding: 15px 40px;
//     background-color: #165277;
//     color: #fff;
//     font-size: 18px;
//     font-weight: bold;
//     border: none;
//     border-radius: 4px;
//     cursor: pointer;

//     &:hover {
//         background-color: #165277;
//     }
    
//     &:disabled {
//         background-color: #ccc;
//         cursor: not-allowed;
//     }
// `;

// const IconButton = styled.button`
//     background: none;
//     border: none;
//     border-radius: 4px;
//     margin: 0 20px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     gap: 10px;
//     color: #165277;
//     font-size: 16px;
//     font-weight: bold;
// `;
