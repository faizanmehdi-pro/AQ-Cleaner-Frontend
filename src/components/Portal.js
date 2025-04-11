import React from 'react';
import styled from 'styled-components';

// Styled component for the EditCard container
const StyledEditCard = styled.div`
    position: absolute;
    top: -50px;
    background: #000;
    border: 1px solid #165277;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    gap: 10px;
    z-index: 9999;
`;

// Styled component for individual edit icons
const StyledEditIcon = styled.button`
    background: none;
    border: none;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: #165277;
    }
`;

const Portal = ({ toggleEditing, changeFontSize, deleteTextBox }) => {
    return (
        <StyledEditCard>
            <StyledEditIcon onClick={toggleEditing}>💾</StyledEditIcon>
            <StyledEditIcon onClick={() => changeFontSize(1)}>A+</StyledEditIcon>
            <StyledEditIcon onClick={() => changeFontSize(-1)}>A-</StyledEditIcon>
            <StyledEditIcon onClick={deleteTextBox}>🗑️</StyledEditIcon>
        </StyledEditCard>
    );
};

export default Portal;
