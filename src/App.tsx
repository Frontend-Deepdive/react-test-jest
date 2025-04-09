import LoginForm from "./components/LoginForm";
import { login } from "./api/auth";

function App() {
  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await login(username, password);
      alert(`Login successful: ${response.message}`);
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default App;
