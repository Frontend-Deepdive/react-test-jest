import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import "@testing-library/jest-dom";

describe("회원가입 테스트", () => {
  let emailInput: HTMLInputElement,
    passwordInput: HTMLInputElement,
    confirmPasswordInput: HTMLInputElement,
    signupButton: HTMLButtonElement;

  // given : 테스트 실행을 위한 환경 구성
  beforeEach(() => {
    const queryClient = new QueryClient();

    // 테스트용 라우터 설정
    const routes = [
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ["/signup"], // 초기 진입 경로
    });

    // 테스트를 위한 컴포넌트 렌더링
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    emailInput = screen.getByPlaceholderText("이메일을 입력해주세요");
    passwordInput = screen.getByPlaceholderText("비밀번호를 입력해주세요");
    confirmPasswordInput = screen.getByPlaceholderText("비밀번호를 한 번 더 입력해주세요");
    signupButton = screen.getByRole("button", { name: /회원가입/i });
  });

  test("회원가입 페이지가 렌더링된다", () => {
    expect(emailInput).toBeInTheDocument();
  });

  test("회원가입 페이지 진입 시 회원가입 버튼은 비활성화 상태다", () => {
    expect(signupButton).toBeDisabled();
  });

  test("비밀번호와 비밀번호 확인이 일치하지 않으면 에러 메시지가 표시된다", async () => {
    // when : 비밀번호와 비밀번호 확인이 다르게 입력되었을 때
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "hello" } });

    // then : 에러 메시지가 화면에 보여야 한다
    const errorMessage = await screen.findByTestId("error-message");
    expect(errorMessage).toHaveTextContent("비밀번호가 일치하지 않습니다");
  });

  test("이메일을 입력하고, 비밀번호와 비밀번호 확인이 일치하면 회원가입 버튼이 활성화된다", () => {
    // when : 이메일을 입력하고, 비밀번호와 비밀번호 확인이 동일하게 입력되었을 때
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    // then: 회원가입 버튼이 활성화되어야 한다
    expect(signupButton).toBeEnabled();
  });
});
