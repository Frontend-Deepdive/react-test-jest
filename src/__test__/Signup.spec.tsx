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
    /* --- given: 폼에 잘못된 비밀번호 입력 --- */
    fillSignupForm('test@email.com', 'test', 'test2');

    /* --- when: 에러 메시지를 화면에서 찾기 --- */
    const errorMessage = await screen.findByTestId('error-message', {}, { timeout: 2000 });

    /* --- then: 에러 메시지 표시 검증 --- */
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('비밀번호가 일치하지 않습니다');
  });

  test('이미 존재하는 이메일로 가입 시도 시 에러가 발생한다', async () => {
    /* --- given: 이메일 중복 시나리오 모킹 --- */
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockMutate.mockImplementation((data: SignupFormData) => {
      if (data.username === 'test@email.com') {
        console.error('Signup failed: Email already exists');
        return false;
      }
      return true;
    });

    /* --- when: 이미 존재하는 이메일로 폼 입력 후 회원가입 버튼 클릭 --- */
    const { signupButton } = fillSignupForm('test@email.com', 'test', 'test');
    fireEvent.click(signupButton);

    /* --- then: 콘솔 에러 메시지 출력 --- */
    await waitFor(
      () => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Signup failed'));
      },
      { timeout: 2000 },
    );

    // 모킹 해제
    consoleSpy.mockRestore();
  });

  test('올바른 정보 입력 시 회원가입 버튼이 활성화된다', async () => {
    /* --- given: mutate 함수 성공 시나리오 모킹 --- */
    mockMutate.mockImplementation(() => true);

    /* --- when: 올바른 정보로 폼 입력 --- */
    const { signupButton } = fillSignupForm('youngju@email.com', 'youngju', 'youngju');

    /* --- then: 회원가입 버튼 활성화 확인 --- */
    expect(signupButton).toBeEnabled();
  });

  test('회원가입 폼 제출 시 mutate 함수가 올바른 데이터와 함께 호출된다', async () => {
    /* --- when: 올바른 정보로 폼 입력 후 회원가입 버튼 클릭 --- */
    const email = 'youngju@email.com';
    const password = 'youngju';
    const { signupButton } = fillSignupForm(email, password, password);

    /* --- when: 회원가입 버튼 클릭 --- */
    fireEvent.click(signupButton);

    /* --- then: mutate 함수가 올바른 데이터로 호출됨 --- */
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
