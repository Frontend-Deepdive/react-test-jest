// style.tsx
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
`;

export const FormCard = styled.form`
  background-color: #fff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

export const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #3478f6;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2565d0;
  }
`;
