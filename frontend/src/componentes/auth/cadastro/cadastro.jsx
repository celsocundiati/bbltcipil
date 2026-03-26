import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../service/api/api";

export default function CadastroUsuario() {
  const [form, setForm] = useState({
    n_identificacao: "",
    n_bilhete: "",
    password: "",
    email: "",
  });

  const navigate = useNavigate();
  const [errosCampos, setErrosCampos] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const validarCampo = (name, value) => {
    switch (name) {
      case "n_identificacao":
        return value.length >= 3 ? "" : "Número inválido";
      case "n_bilhete":
        return value.length >= 8 ? "" : "Bilhete inválido";
      case "password":
        return value.length >= 8 ? "" : "Senha deve ter pelo menos 8 caracteres";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrosCampos({ ...errosCampos, [name]: validarCampo(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    const errosExistentes = Object.values(errosCampos).filter(Boolean);
    if (errosExistentes.length) {
      setErro(errosExistentes.join(" | "));
      return;
    }

    if (!form.n_identificacao || !form.n_bilhete || !form.password || !form.email) {
      setErro("Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);
    try {
      await api.post("/accounts/signup/", form);
      setMensagem("Cadastro realizado com sucesso!");
      setForm({ n_identificacao: "", n_bilhete: "", password: "", email: "" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.data) {
        const errors = Object.values(err.response.data).flat();
        setErro(errors.join(" | "));
      } else {
        setErro("Erro ao realizar cadastro.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-[#F97B17]">
          Cadastro de Usuário
        </h1>

        {mensagem && <p className="text-center text-green-600 font-medium">{mensagem}</p>}
        {erro && <p className="text-center text-red-600 font-medium">{erro}</p>}

        <div className="space-y-4">
          <input
            type="text"
            name="n_identificacao"
            placeholder="Número de Processo ou Agente *"
            value={form.n_identificacao}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97B17]/80 ${
              errosCampos.n_identificacao ? "border-red-500" : "border-black/10"
            }`}
            required
          />
          <input
            type="text"
            name="n_bilhete"
            placeholder="BI *"
            value={form.n_bilhete}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97B17]/80 ${
              errosCampos.n_bilhete ? "border-red-500" : "border-black/10"
            }`}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="email@gmail.com *"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97B17]/80"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha *"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97B17]/80 ${
              errosCampos.password ? "border-red-500" : "border-black/10"
            }`}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold cursor-pointer text-white transition-colors ${
            loading ? "bg-[#F97B17]/50 cursor-not-allowed" : "bg-[#F97B17] hover:bg-[#F97B17]/90"
          }`}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <p className="text-center text-gray-600 text-sm">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-[#F97B17] font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  );
}