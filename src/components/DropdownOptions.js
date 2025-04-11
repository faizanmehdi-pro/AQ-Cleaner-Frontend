import React, { useState } from 'react';
import styled from 'styled-components';
import { CleanDocument } from '../APIS/CleanDocument';

const DropdownOptions = ({ selectedOption, onOptionChange, uploadedFileURL }) => {
    console.log("fileURL", uploadedFileURL);
    const [isLoading, setIsLoading] = useState(false);

    const handleOptionChange = (e) => {
        const value = e.target.value;
        onOptionChange(value);
    };

    const handleSubmit = () => {
        // Validation to check if required fields are selected
        if (!selectedOption || !uploadedFileURL) {
            alert("Please select a region and upload a file.");
            return;
        }

        setIsLoading(true); // Start loader
        const fileData = {
            region: selectedOption,
            file_url: uploadedFileURL,
        };

        CleanDocument(fileData)
            .then((resp) => {
                window.open(resp?.pdf_url);
            })
            .catch((err) => {
                console.log('Upload error:', err);
                alert("An error occurred while cleaning the document.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <DropdownWrapper>
            <StyledSelect value={selectedOption} onChange={handleOptionChange}>
                <option value="">Select Cleaning Zone</option>
                <option value="header">Header</option>
                <option value="left">Left Side</option>
                <option value="right">Right Side</option>
                <option value="footer">Footer</option>
                <option value="frame">Frame</option>
                <option value="all">Whole Page</option>
            </StyledSelect>
            <StyledButton onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Submit'}
            </StyledButton>
        </DropdownWrapper>
    );
};

export default DropdownOptions;

// Styled Components
const DropdownWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
`;

const StyledSelect = styled.select`
    padding: 10px;
    font-size: 16px;
    border: 2px solid #165277;
    border-radius: 8px;
    color: #333;
    cursor: pointer;
    outline: none;
    width: 400px;

    @media screen and (max-width: 768px) {
        width: 200px;
    }
`;

const StyledButton = styled.button`
    height: 45px;
    width: 100px;
    background-color: #165277;
    color: white;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        background-color: #0056b3;
        box-shadow: 0 0 8px rgba(0, 91, 187, 0.3);
    }

    &:active {
        background-color: #004494;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;
