import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../userAuth/useauth"; 

function LoginPage() {

  const [n_identificacao, setIdentificacao] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {

    e.preventDefault();
    setErro("");
    setLoading(true);

    try {

      await login(n_identificacao, password);

      navigate("/");

    } catch (err) {

      const mensagem =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Username ou senha incorretos.";

      setErro(mensagem);
      console.log(mensagem)

    } finally {

      setLoading(false);

    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">

        <h1 className="text-2xl mb-6 font-bold text-center text-[#F97B17]">
          Acesso à Plataforma
        </h1>

        {erro && (
          <p className="text-red-600 mb-4 text-center font-medium">
            {erro}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Username institucional"
            value={n_identificacao}
            onChange={(e) => setIdentificacao(e.target.value)}
            className="px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <p className="text-gray-600 text-sm">
            <Link to="/recuperacaosenha" className="text-orange-500 font-medium">
              Esqueceu a sua senha?
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Ainda não possui conta?{" "}
          <Link to="/cadastro" className="text-orange-500 font-medium">
            Criar conta
          </Link>
        </p>

      </div>

    </main>
  );
}

export default LoginPage;