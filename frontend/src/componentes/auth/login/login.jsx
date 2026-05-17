
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../userAuth/useauth";
import api from "../../service/api/api";

import LogoIPIL from "../../../assets/ipillogo.png";
import Fundo from "../../../assets/bck.jpg";

export default function AuthPage() {
  const [tab, setTab] = useState("login"); // login | register | reset

  // LOGIN
  const [n_identificacao, setIdentificacao] = useState("");
  const [password, setPassword] = useState("");

  // REGISTER
  const [form, setForm] = useState({
    n_identificacao: "",
    n_bilhete: "",
    password: "",
    email: "",
  });

  // RESET
  const [email, setEmail] = useState("");

  // GLOBAL
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ---------------- LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      await login(n_identificacao, password);
      navigate("/");
    } catch (err) {
      setErro(
        err.response?.data?.detail ||
          "Credenciais inválidas."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro("");
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/accounts/signup/", form);

      setMsg(res.data.message || "Conta criada com sucesso!");
      setTab("login");

    } catch (err) {
      console.log("ERRO BACKEND:", err.response?.data);

      const backendErrors = err.response?.data?.errors;

      if (backendErrors) {
        // transforma erros do DRF em texto legível
        const firstKey = Object.keys(backendErrors)[0];
        const firstError = backendErrors[firstKey][0];

        setErro(firstError);
      } else {
        setErro(
          err.response?.data?.message ||
          "Erro inesperado ao criar conta."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  // ---------------- RESET ----------------
  const handleReset = async (e) => {
    e.preventDefault();
    setErro("");
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/accounts/password-reset/", { email });
      setMsg(res.data.message);
    } catch (err) {
      setErro("Erro ao enviar email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
    >
      {/* BACKGROUND FIXO */}
      <div className="absolute inset-0">
        <img
          src={Fundo}
          className="w-full h-full object-cover object-center"
          alt="background"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" />
      
      {/* CARD PRINCIPAL */}
      <div className="bg-white/85 p-8 rounded-2xl shadow-lg w-full max-w-sm z-50">

        {/* LOGO */}
        <div className="flex justify-center">
          <img src={LogoIPIL} className="w-32 h-32" />
        </div>

        <h1 className="text-xl text-center font-medium text-[#F97B17] mb-6">
          Biblioteca IPIL
        </h1>

        {/* TABS */}
        <div className="flex justify-between mb-6 text-sm font-medium">
          <button
            onClick={() => setTab("login")}
            className={`cursor-pointer ${tab === "login" ? "text-orange-500" : "text-gray-500"}`}
          >
            Login
          </button>

          <button
            onClick={() => setTab("register")}
            className={`cursor-pointer ${tab === "register" ? "text-orange-500" : "text-gray-500"}`}
          >
            Criar
          </button>

          <button
            onClick={() => setTab("reset")}
            className={`cursor-pointer ${tab === "reset" ? "text-orange-500" : "text-gray-500"}`}
          >
            Recuperar
          </button>
        </div>


        {/* ---------------- LOGIN FORM ---------------- */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              placeholder="Username"
              value={n_identificacao}
              onChange={(e) => setIdentificacao(e.target.value)}
              className="px-4 py-2 border bg-gray-300 border-black/10 h-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 border bg-gray-300 border-black/10 h-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />

            <button className="bg-orange-500 text-white p-2 rounded-lg cursor-pointer">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        )}

        {/* ---------------- REGISTER FORM ---------------- */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <input
              placeholder="Nº Identificação"
              value={form.n_identificacao}
              onChange={(e) =>
                setForm({ ...form, n_identificacao: e.target.value })
              }
              className="px-4 py-2 border bg-gray-300 border-black/10 h-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />

            <input
              placeholder="BI"
              value={form.n_bilhete}
              onChange={(e) =>
                setForm({ ...form, n_bilhete: e.target.value })
              }
              className="px-4 py-2 border bg-gray-300 border-black/10 h-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />

            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="px-4 py-2 border bg-gray-300 border-black/10 h-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="px-4 py-2 border bg-gray-300 border-black/10 h-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />

            <button className="bg-orange-500 text-white p-2 rounded-lg cursor-pointer">
              {loading ? "Criando..." : "Criar conta"}
            </button>
          </form>
        )}

        {/* ---------------- RESET FORM ---------------- */}
        {tab === "reset" && (
          <form onSubmit={handleReset} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border bg-gray-300 border-black/10 h-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />

            <button className="bg-orange-500 text-white p-2 rounded-lg cursor-pointer">
              {loading ? "Enviando..." : "Enviar link"}
            </button>
          </form>
        )}
        
        {/* ERROS / MSG */}
        {erro && <p className="text-red-600 text-center mt-2">{erro}</p>}
        {msg && <p className="text-green-600 text-center mt-2">{msg}</p>}

        {/* LINK EXTRA */}
        <p className="text-center text-sm mt-4 text-gray-600">
          Sistema integrado IPIL
        </p>
      </div>
    </main>
  );
}




