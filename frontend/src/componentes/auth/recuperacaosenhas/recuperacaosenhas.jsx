import { useState } from "react";
import api from "../../service/api/api";
import { Link } from "react-router-dom";

export default function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await api.post("/accounts/password-reset/", { email });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.error || "Erro ao enviar email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-medium text-[#F97B17]">Recuperar Senha</h1>
          <p className="text-gray-500 mt-2">
            Insira seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full py-3 px-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97B17]/80 placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg font-semibold text-white transition-colors  cursor-pointer
                        ${loading ? "bg-[#F97B17]/50 cursor-not-allowed" : "bg-[#F97B17] hover:bg-[#F97B17]/90"}`}
          >
            {loading ? "Enviando..." : "Enviar Link"}
          </button>
          {msg && (
            <p
              className={`text-center mt-3 font-medium ${
                msg.includes("erro") ? "text-red-500" : "text-[#F97B17]"
              }`}
            >
              {msg}
            </p>
          )}
        </form>
        <div className="mt-6 text-center text-gray-500 text-sm">
          Lembrou sua senha?{" "}
          <Link to="/login" className="text-[#F97B17] font-medium hover:underline">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}