import React from 'react';
import { render, screen } from '@testing-library/react';
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
});

