import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../service/api/api";
import { useAuth } from "../../auth/userAuth/useAuth";

export default function Privacidade() {
  const { user, setUser } = useAuth(); // pega dados do contexto
  const [email, setEmail] = useState(user?.user?.email || "");
  const [telefone, setTelefone] = useState(user?.perfil?.telefone || "");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const baseinput = "w-full border border-gray-300 rounded-lg px-4 py-2";
  const baselabel = "block text-sm font-medium text-gray-700 mb-1";

  const validarEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarTelefone = (tel) =>
    /^\d{9,15}$/.test(tel);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!validarEmail(email)) {
      setErro("Email inválido.");
      return;
    }
    if (!validarTelefone(telefone)) {
      setErro("Telefone inválido. Use apenas números (8-15 dígitos).");
      return;
    }

    try {
      setLoading(true);
      const payload = { email, telefone };
      await api.patch("/accounts/me/", payload);

      setSucesso("Dados atualizados com sucesso!");
      // Atualiza o user no contexto
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
      className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Dados da conta</h2>
      <p className="text-gray-500 mb-6">
        Atualize seus dados para manter sua conta atualizada.
      </p>

      {erro && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{erro}</div>}
      {sucesso && <div className="bg-green-100 text-green-600 p-3 rounded mb-4">{sucesso}</div>}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className={baselabel}>Nome</label>
          <input type="text" value={user?.user?.first_name || user?.user?.username} readOnly className={baseinput} />
        </div>

        <div>
          <label className={baselabel}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={baseinput} />
        </div>

        <div>
          <label className={baselabel}>Telefone</label>
          <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} className={baseinput} />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          {loading ? "Atualizando..." : "Atualizar dados"}
        </button>
      </form>
    </motion.div>
  );
}