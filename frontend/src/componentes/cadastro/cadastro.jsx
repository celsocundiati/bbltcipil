import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"

function CadastroAluno() {
  const [form, setForm] = useState({
    n_processo: "",
    n_bilhete: "",
    password: "",
    telefone: "",
    email: "",
  });

  const navigate = useNavigate()

  const [errosCampos, setErrosCampos] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const validarCampo = (name, value) => {
    switch (name) {
      case "n_processo":
        return /^[0-9]+$/.test(value) ? "" : "Número de processo deve conter apenas números";
      case "n_bilhete":
        return value.length >= 8 ? "" : "Bilhete inválido";
      case "password":
        return value.length >= 8 ? "" : "Senha deve ter pelo menos 6 caracteres";
      case "telefone":
        return /^\d{9,15}$/.test(value.replace(/\D/g, "")) ? "" : "Telefone inválido";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const valor = name === "telefone" ? value.replace(/\D/g, "") : value;

    setForm({ ...form, [name]: valor });
    setErrosCampos({ ...errosCampos, [name]: validarCampo(name, valor) });
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

    if (!form.n_processo || !form.n_bilhete || !form.password || !form.email) {
      setErro("Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/accounts/signup/", form
      );
      setMensagem("Cadastro realizado com sucesso!");
      setForm({ n_processo: "", n_bilhete: "", password: "", telefone: "", email: "" });
      setErrosCampos({});
      navigate("/")
    } catch (err) {
      if (err.response?.data) {
        const errors = Object.values(err.response.data).flat();
        setErro(errors.join(" | "));
      } else {
        setErro("Erro ao realizar cadastro. Verifique os dados.");
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
        <h1 className="text-2xl font-bold text-center mb-4">Cadastro de Estudante</h1>

        {mensagem && <p className="text-green-600 text-center">{mensagem}</p>}
        {erro && <p className="text-red-600 text-center">{erro}</p>}

        <input
          type="text"
          name="n_processo"
          placeholder="Número de Processo *"
          value={form.n_processo}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errosCampos.n_processo ? "border-red-500" : ""}`}
          required
        />
        {errosCampos.n_processo && <p className="text-red-500 text-sm">{errosCampos.n_processo}</p>}

        <input
          type="text"
          name="n_bilhete"
          placeholder="BI *"
          value={form.n_bilhete}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errosCampos.n_bilhete ? "border-red-500" : ""}`}
          required
        />
        {errosCampos.n_bilhete && <p className="text-red-500 text-sm">{errosCampos.n_bilhete}</p>}

        <input
          type="password"
          name="password"
          placeholder="Senha *"
          value={form.password}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errosCampos.password ? "border-red-500" : ""}`}
          required
        />
        {errosCampos.password && <p className="text-red-500 text-sm">{errosCampos.password}</p>}

        <input
          type="tel"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errosCampos.telefone ? "border-red-500" : ""}`}
        />
        {errosCampos.telefone && <p className="text-red-500 text-sm">{errosCampos.telefone}</p>}

        <input
          type="email"
          name="email"
          placeholder="nome@gmail.com"
          value={form.email}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errosCampos.email ? "border-red-500" : ""}`}
        />
        {errosCampos.email && <p className="text-red-500 text-sm">{errosCampos.email}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </main>
  );
}

export default CadastroAluno;