import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SignupPage from '../pages/SignupPage';
import '@testing-library/jest-dom';

// useSignup 훅 모킹
jest.mock('../hooks/useSignup', () => ({
  __esModule: true,
  default: () => ({
    mutate: jest.fn((data) => {
      if (data.username === 'test@email.com') {
        console.error('Signup failed: Email already exists');
        return false;
      }
      return true;
    }),
    isSuccess: false,
  }),
}));

describe('회원가입 테스트', () => {
  // beforeEach: 테스트 전 페이지 초기 렌더링 설정
  beforeEach(() => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/signup']}>
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  // 실패 케이스 1
  test('비밀번호 중복 검사 실패', async () => {
    const emailInput = screen.getByPlaceholderText('이메일을 입력해주세요');
    const passwordInput = screen.getByPlaceholderText('비밀번호를 입력해주세요');
    const confirmPasswordInput = screen.getByPlaceholderText('비밀번호를 한 번 더 입력해주세요');

    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'test2' } });

    // 화면에 렌더링되는 에러 메시지 확인
    const errorMessage = await screen.findByTestId('error-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('비밀번호가 일치하지 않습니다');
  });

  // 실패 케이스 2
  test('이메일 중복 검사 실패', async () => {
    // spyOn을 사용한 콘솔 에러 모킹
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const emailInput = screen.getByPlaceholderText('이메일을 입력해주세요');
    const passwordInput = screen.getByPlaceholderText('비밀번호를 입력해주세요');
    const confirmPasswordInput = screen.getByPlaceholderText('비밀번호를 한 번 더 입력해주세요');
    const signupButton = screen.getByRole('button', { name: '회원가입' });

    fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'test' } });
    fireEvent.click(signupButton);

    // waitFor: 비동기 처리가 완료될 때까지 기다림((회원가입 api 호출))
    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Signup failed')),
    );

    // 모킹 해제
    consoleSpy.mockRestore();
  });

  // 성공 케이스
  test('비밀번호 입력 성공', async () => {
    const signupButton = screen.getByRole('button', { name: '회원가입' });
    const emailInput = screen.getByPlaceholderText('이메일을 입력해주세요');
    const passwordInput = screen.getByPlaceholderText('비밀번호를 입력해주세요');
    const confirmPasswordInput = screen.getByPlaceholderText('비밀번호를 한 번 더 입력해주세요');

    fireEvent.change(emailInput, { target: { value: 'youngju@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'youngju' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'youngju' } });

    // 버튼이 성공적으로 활성화되었는지 확인
    expect(signupButton).toBeEnabled();
  });
});
