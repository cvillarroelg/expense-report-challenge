import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, login } from "../services/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("El correo no es válido");
      return;
    }

    if (!password) {
      setError("La contraseña no puede estar vacía");
      return;
    }

    try {
      // 1️⃣ Login
      const { token } = await login(email, password);
      localStorage.setItem("token", token);

      // 2️⃣ Validar token
      await getMe();

      // 3️⃣ Ir al dashboard
      navigate("/dashboard");
    } catch (err: any) {
      localStorage.removeItem("token");
      setError(err.message || "Error al iniciar sesión");
    }
  };

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Log in
        </button>
      </form>
    </div>
  );
}

export default Login;
