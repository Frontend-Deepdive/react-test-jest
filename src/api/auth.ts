// src/api/auth.ts
export const login = async (username: string, password: string) => {
  // 실제 API 연동은 여기에
  if (username === "admin@naver.com" && password === "password") {
    return Promise.resolve({ message: "Welcome!" });
  } else {
    return Promise.reject(new Error("Invalid credentials"));
  }
};
