import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../service/api/api";
import { useAuth } from "../userAuth/useauth";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"

export default function Privacidade() {
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState(user?.user?.email || "");
  const [telefone, setTelefone] = useState(user?.perfil?.telefone || "");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const baseinput = "w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition";
  const baselabel = "block text-sm font-semibold text-gray-700 mb-1";

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarTelefone = (tel) => /^\d{9,15}$/.test(tel);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!validarEmail(email)) {
      setErro("Email inválido.");
      return;
    }
    if (!validarTelefone(telefone)) {
      setErro("Telefone inválido. Use apenas números (9-15 dígitos).");
      return;
    }

    try {
      setLoading(true);
      const payload = { email, telefone };
      await api.patch("/accounts/me/", payload);

      setSucesso("Dados atualizados com sucesso!");
      setUser((prev) => ({
        ...prev,
        user: { ...prev.user, email },
        perfil: { ...prev.perfil, telefone },
      }));
    } catch (error) {
      console.log("Erro ao atualizar dados:", error.response?.data || error);
      setErro("Falha ao atualizar dados. Verifique os valores e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex relative items-center justify-center p-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute top-4 left-3 gap-4">
        <Link to="/perfil">
          <FiArrowLeft size={30} />
        </Link>
      </div>

      <section className="max-w-lg mx-auto bg-white shadow-xl rounded-3xl p-8 sm:p-10 mt-10">
        <h2 className="text-2xl font-medium text-gray-800 mb-1">Dados da Conta</h2>
        <p className="text-gray-500 mb-6">Atualize seus dados para manter sua conta segura e atualizada.</p>

        {erro && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4">{erro}</div>}
        {sucesso && <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-xl mb-4">{sucesso}</div>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className={baselabel}>Nome</label>
            <input
              type="text"
              value={user?.user?.first_name || user?.user?.username}
              readOnly
              className={`${baseinput} bg-gray-100 cursor-not-allowed`}
            />
          </div>

          <div>
            <label className={baselabel}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={baseinput}
            />
          </div>

          <div>
            <label className={baselabel}>Telefone</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className={baseinput}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Atualizando..." : "Atualizar Dados"}
          </button>
        </form>
      </section>
      
    </motion.div>
  );
}