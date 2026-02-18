import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      console.log("Tentando login com:", { username, password });

      /*const res = await axios.post(
        "http://localhost:8000/api/accounts/login/",
        {
          username: username,
          password: password,
        }
      );*/
      const res = await axios.post(
        "http://localhost:8000/api/accounts/login/",
        { username, password }, // dados
        { headers: { "Content-Type": "application/json" } } // garante JSON
      );



      // 🔑 Salva tokens no sessionStorage
      sessionStorage.setItem("access_token", res.data.access);
      sessionStorage.setItem("refresh_token", res.data.refresh);

      console.log("Login realizado. Tokens:", res.data);
      navigate("/");

    } catch (err) {
       console.error("Erro login:", err.response?.data);
       setErro(err.response?.data?.detail || "Username ou senha incorretos"); 

      if (err.response?.status === 401) {
        setErro("Username ou senha incorretos.");
      } else {
        const mensagem =
          err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          "Username ou senha incorretos.";

        setErro(mensagem);

      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Acesso à Plataforma
        </h1>

        {erro && (
          <p className="text-red-600 mb-4 text-center font-medium">
            {erro}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="username"
            placeholder="Username institucional"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            disabled={loading}
            className="bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Ainda não possui conta?{" "}
          <a href="/cadastro" className="text-orange-500 font-medium">
            Criar conta
          </a>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
