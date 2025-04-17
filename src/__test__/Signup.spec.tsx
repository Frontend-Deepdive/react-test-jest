import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SignupPage from '../pages/SignupPage';
import '@testing-library/jest-dom';
import useSignup from '../hooks/useSignup';
import { SignupFormData } from './types/signup.types';
import { fillSignupForm } from './utils/fillSignupForm';

// useSignup 훅 모킹
jest.mock('../hooks/useSignup');

describe('SignupPage 컴포넌트', () => {
  let queryClient: QueryClient;
  let mockMutate: jest.Mock<boolean | void, [SignupFormData]>;

  // beforeEach: 테스트마다 모킹 및 렌더링 초기화
  beforeEach(() => {
    mockMutate = jest.fn();
    (useSignup as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
    });

    queryClient = new QueryClient({
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

  // 모든 모킹 해제
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('비밀번호와 확인 비밀번호가 일치하지 않으면 오류 메시지를 표시한다', async () => {
    // 폼 입력
    fillSignupForm('test@email.com', 'test', 'test2');

    // 에러 메시지 확인
    const errorMessage = await screen.findByTestId('error-message', {}, { timeout: 2000 });
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('비밀번호가 일치하지 않습니다');
  });

  test('이미 존재하는 이메일로 가입 시도 시 에러가 발생한다', async () => {
    // 콘솔 에러 모킹
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // 이메일 중복 시나리오 모킹
    mockMutate.mockImplementation((data: SignupFormData) => {
      if (data.username === 'test@email.com') {
        console.error('Signup failed: Email already exists');
        return false;
      }
      return true;
    });

    const { signupButton } = fillSignupForm('test@email.com', 'test', 'test');
    fireEvent.click(signupButton);

    // waitFor: 비동기 처리가 완료될 때까지 기다림(회원가입 api 호출)
    await waitFor(
      () => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Signup failed'));
      },
      { timeout: 2000 },
    );

    /*
     * 모킹 해제
     * - 콘솔 에러는 전역 객체
     * - 따라서 테스트 간에 영향을 미치지 않도록 해제 필요
     */
    consoleSpy.mockRestore();
  });

  // 성공 케이스
  test('올바른 정보 입력 시 회원가입 버튼이 활성화된다', async () => {
    mockMutate.mockImplementation(() => true);

    // 폼 입력
    const { signupButton } = fillSignupForm('youngju@email.com', 'youngju', 'youngju');

    // 버튼이 성공적으로 활성화되었는지 확인
    expect(signupButton).toBeEnabled();
  });

  test('회원가입 폼 제출 시 mutate 함수가 올바른 데이터와 함께 호출된다', async () => {
    const email = 'newuser@email.com';
    const password = 'securepassword';
    const { signupButton } = fillSignupForm(email, password, password);
    fireEvent.click(signupButton);

    // mutate 호출 확인
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          username: email,
          password: password,
        }),
      );
    });
  });
});
