import { fireEvent, screen } from '@testing-library/react';
import { SignupFormElements } from '../types/signup.types';

/**
 * 회원가입 폼의 입력 필드를 채우는 유틸리티 함수
 * @param email 이메일 입력값
 * @param password 비밀번호 입력값
 * @param confirmPassword 비밀번호 확인 입력값
 * @returns 폼 요소 객체
 */

export const fillSignupForm = (
  email: string,
  password: string,
  confirmPassword: string,
): SignupFormElements => {
  const emailInput = screen.getByPlaceholderText('이메일을 입력해주세요');
  const passwordInput = screen.getByPlaceholderText('비밀번호를 입력해주세요');
  const confirmPasswordInput = screen.getByPlaceholderText('비밀번호를 한 번 더 입력해주세요');

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, { target: { value: confirmPassword } });

  return {
    emailInput,
    passwordInput,
    confirmPasswordInput,
    signupButton: screen.getByRole('button', { name: '회원가입' }),
  };
};
