import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import logo from '../assets/logo.jpeg';

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  label{
    color: #165277;
    font-size: 17px;
    margin: 10px 0 5px 0;
    font-weight: 600;
  }
`;

const StyledField = styled(Field)`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #165277;
  font-size: 16px;
  background: none;
  outline: none;
  color: #165277;
`;

const ErrorText = styled.div`
  color: #f44336;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #165277;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #45a049;
  }
`;

const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 300px;
`;

// Validation Schema
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginForm = () => {
  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Container>
      <FormWrapper>
        <LogoContainer>
            <img src={logo} alt='logo' />
        </LogoContainer>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <StyledForm>
              <label htmlFor="email">Email</label>
              <StyledField type="email" id="email" name="email" placeholder="juan@gmail.com" />
              <ErrorMessage component={ErrorText} name="email" />

              <label htmlFor="password">Password</label>
              <StyledField type="password" id="password" name="password" placeholder="********" />
              <ErrorMessage component={ErrorText} name="password" />

              <SubmitButton type="submit">Login</SubmitButton>
            </StyledForm>
          )}
        </Formik>
      </FormWrapper>
    </Container>
  );
};

export default LoginForm;
