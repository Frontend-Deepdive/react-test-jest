import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import SignupPage from '../pages/SignupPage';
import '@testing-library/jest-dom'; 

describe('회원가입 테스트', () => {
  // given : 테스트 실행을 위한 환경 구성 
  beforeEach(() => {
    const queryClient = new QueryClient();

    // 테스트용 라우터 설정 
    const routes = [
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/signup'], // 초기 진입 경로
    });

    // 테스트를 위한 컴포넌트 렌더링 
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  });

  test('회원가입 페이지가 렌더링된다', () => {
    const emailInput = screen.getByPlaceholderText('이메일을 입력해주세요');
    expect(emailInput).toBeInTheDocument(); 
  });

  test('비밀번호와 비밀번호 확인이 일치하지 않으면 에러 메시지가 표시된다', () => {
    // when : 비밀번호와 비밀번호 확인이 다르게 입력되었을 때
    const passwordInput = screen.getByPlaceholderText('비밀번호를 입력해주세요');
    const confirmPasswordInput = screen.getByPlaceholderText('비밀번호를 한 번 더 입력해주세요');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'hello' } });

    // then : 에러 메시지가 화면에 보여야 한다
    const errorMessage = screen.getByTestId('error-message');

    // 디버깅용 콘솔 출력
    console.log('🚨 에러 메시지:', errorMessage.textContent);

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('비밀번호가 일치하지 않습니다');
  });
});

