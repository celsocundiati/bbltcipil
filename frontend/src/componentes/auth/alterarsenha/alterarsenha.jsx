import { useState } from "react";
import api from "../../service/api/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

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
      await api.post("/accounts/alterar-senha/", {
        senha_atual: senhaAtual,
        nova_senha: novaSenha
      });
      setSucesso("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error) {
      console.log("Erro completo:", error);
      const data = error?.response?.data;

      if (data?.senha_atual) setErro(Array.isArray(data.senha_atual) ? data.senha_atual[0] : data.senha_atual);
      else if (data?.nova_senha) setErro(Array.isArray(data.nova_senha) ? data.nova_senha[0] : data.nova_senha);
      else if (data?.detail) setErro(data.detail);
      else if (error.response?.status === 500) setErro("Erro interno do servidor.");
      else setErro("Erro ao alterar senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex relative items-center justify-center p-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute top-4 left-3 gap-4">
        <Link to="/perfil">
          <FiArrowLeft size={30} />
        </Link>
      </div>

      <section className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          
        <h2 className="text-2xl font-medium text-[#F97B17] mb-2 text-center">
          Alterar Senha
        </h2>

        <p className="text-[#333333] text-center mb-6">
          Atualize sua senha para manter sua conta segura.
        </p>

        {erro && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">
            {erro}
          </div>
        )}
        {sucesso && (
          <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-center">
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* senha atual */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Senha Atual
            </label>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-black/10 focus:ring-2 focus:ring-[#F97B17]/80 outline-none transition"
            />
          </div>

          {/* nova senha */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Nova Senha
            </label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-black/10 focus:ring-2 focus:ring-[#F97B17]/80 outline-none transition"
            />
          </div>

          {/* confirmar senha */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-black/10 focus:ring-2 focus:ring-[#F97B17]/80 outline-none transition"
            />
          </div>

          {/* dicas de segurança */}
          <div className="text-sm text-[#555555] text-center">
            A senha deve ter pelo menos <b>8 caracteres</b>.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F97B17] text-white py-2 rounded-lg hover:bg-[#d96b10] transition font-semibold"
          >
            {loading ? "Atualizando..." : "Atualizar Senha"}
          </button>

        </form>
      </section>

    </motion.div>
  );
}