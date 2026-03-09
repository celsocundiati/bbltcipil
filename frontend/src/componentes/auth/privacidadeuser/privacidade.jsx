import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPerfilUsuario } from "../../service/usuarioservice/userservice";
import api from "../../service/api/api"; // Instância centralizada do Axios

export default function Privacidade() {
  const [dados, setDados] = useState({});
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await getPerfilUsuario();
        setDados(data);
        setEmail(data?.user?.email || "");
        setTelefone(data?.perfil?.telefone || "");
      } catch (err) {
        console.log("Erro ao buscar perfil:", err);
      }
    };

    fetchPerfil();
  }, []);

  const baseinput = "w-full border border-gray-300 rounded-lg px-4 py-2";
  const baselabel = "block text-sm font-medium text-gray-700 mb-1";

  // Regex de validação
  const validarEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarTelefone = (tel) =>
    /^\d{9,15}$/.test(tel); // entre 8 e 15 dígitos

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

      const payload = {
        email: email,
        telefone: telefone,
      };

      await api.patch("/accounts/me/", payload);

      setSucesso("Dados atualizados com sucesso!");
      // Atualiza local state
      setDados((prev) => ({
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
        {/* Username */}
        <div>
          <label className={baselabel}>Username</label>
          <input
            type="text"
            value={dados?.user?.username || ""}
            readOnly
            className={baseinput}
          />
        </div>

        {/* Email */}
        <div>
          <label className={baselabel}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={baseinput}
          />
        </div>

        {/* Telefone */}
        <div>
          <label className={baselabel}>Telefone</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className={baseinput}
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Atualizando..." : "Atualizar dados"}
        </button>
      </form>
    </motion.div>
  );
}