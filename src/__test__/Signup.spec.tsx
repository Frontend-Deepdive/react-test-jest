import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import SignupPage from '../pages/SignupPage';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe('회원가입 테스트', () => {
  //실패 케이스
  test('비밀번호와 비밀번호 확인 값이 일치하지 않으면 에러메시지가 표시된다', async () => {
    //given - 회원가입 페이지가 그려짐
    const routes = [
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/signup'],
      initialIndex: 0,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
  });
});
