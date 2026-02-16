import { useState } from "react";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        email,
        password,
      });

      // JWT recebido
      const { access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Redireciona ou atualiza interface
      window.location.href = "/"; // ou rota principal
    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Usuário ou senha inválidos");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {erro && (
          <p className="text-red-600 mb-4 text-center font-medium">{erro}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <button
            type="submit"
            className="bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Não tem conta?{" "}
          <a href="/cadastro" className="text-orange-500 font-medium">
            Cadastre-se
          </a>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
