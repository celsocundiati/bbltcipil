import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../service/api/api";

function CadastroUsuario() {
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
      await api.post(
        "/accounts/signup/",
        form
      );

      setMensagem("Cadastro realizado com sucesso!");
      setForm({
        n_identificacao: "",
        n_bilhete: "",
        password: "",
        email: "",
      });

      navigate("/login");
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
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          Cadastro de Utilizador
        </h1>

        {mensagem && <p className="text-green-600 text-center">{mensagem}</p>}
        {erro && <p className="text-red-600 text-center">{erro}</p>}

        <input
          type="text"
          name="n_identificacao"
          placeholder="Número de Processo ou Agente *"
          value={form.n_identificacao}
          onChange={handleChange}
          className={`px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-full ${
            errosCampos.n_identificacao ? "border-red-500" : ""
          }`}
          required
        />
        {errosCampos.n_identificacao && (
          <p className="text-red-500 text-sm">
            {errosCampos.n_identificacao}
          </p>
        )}

        <input
          type="text"
          name="n_bilhete"
          placeholder="BI *"
          value={form.n_bilhete}
          onChange={handleChange}
          className={`px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-full ${
            errosCampos.n_bilhete ? "border-red-500" : ""
          }`}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="email@gmail.com *"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Senha *"
          value={form.password}
          onChange={handleChange}
          className={`px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 w-full ${
            errosCampos.password ? "border-red-500" : ""
          }`}
          required
        />

        <button
          type="submit"
          className="bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 cursor-pointer w-full"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </main>
  );
}

export default CadastroUsuario;