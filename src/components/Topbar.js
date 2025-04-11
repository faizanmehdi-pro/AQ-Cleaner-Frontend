import React from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.jpeg';

const Topbar = () => {
  return (
    <TopbarWrapper>
      <LogoContainer>
          <img src={logo} alt='logo' />
      </LogoContainer>
      <Heading>AQ Cleaner</Heading>
    </TopbarWrapper>
  );
};

export default Topbar;

// Styled Components
const TopbarWrapper = styled.div`
  width: 100%;
  background-color: #fff;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Heading = styled.h1`
  font-size: 28px;
  color: white;
  margin: 0;
  font-weight: bold;
  color: #165277;
`;

const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130px;
    height: 80px;

    img{
    width: 130px;
    height: 80px;
    }
`;