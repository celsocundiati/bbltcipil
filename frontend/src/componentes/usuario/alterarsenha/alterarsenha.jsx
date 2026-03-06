import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AlterarSenha() {

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (novaSenha !== confirmarSenha) {
      setErro("As novas senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 8) {
      setErro("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://127.0.0.1:8000/api/usuarios/alterar-senha/",
        {
          senha_atual: senhaAtual,
          nova_senha: novaSenha
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSucesso("Senha alterada com sucesso!");

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");

    } catch (error) {

      if (error.response?.data?.detail) {
        setErro(error.response.data.detail);
      } else {
        setErro("Erro ao alterar senha. Tente novamente.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Alterar Senha
      </h2>

      <p className="text-gray-500 mb-6">
        Atualize sua senha de acesso para manter sua conta segura.
      </p>

      {erro && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
          {sucesso}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* senha atual */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha Atual
          </label>

          <input
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* nova senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nova Senha
          </label>

          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* confirmar senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Nova Senha
          </label>

          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* dicas de segurança */}
        <div className="text-sm text-gray-500">
          A senha deve ter pelo menos <b>8 caracteres</b>.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Atualizando..." : "Atualizar Senha"}
        </button>

      </form>

    </motion.div>
  );
}