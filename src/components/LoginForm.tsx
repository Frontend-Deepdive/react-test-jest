// LoginForm.tsx
import React, { useState } from "react";
import { Container, FormCard, Title, Input, LoginButton } from "./style";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("이메일:", email, "비밀번호:", password);
    onLogin(email, password);
  };

  return (
    <Container>
      <FormCard onSubmit={handleSubmit}>
        <Title>로그인</Title>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoginButton type="submit">로그인</LoginButton>
      </FormCard>
    </Container>
  );
}
