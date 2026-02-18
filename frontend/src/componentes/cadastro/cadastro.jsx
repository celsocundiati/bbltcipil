import { useState } from "react";
import axios from "axios";

function CadastroAluno() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    n_processo: "",
    curso: "",
    classe: "",
    data_nascimento: "",
    telefone: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // Validação instantânea
  const validarCampo = (name, value) => {
    switch (name) {
      case "username":
        return value.length >= 3 ? "" : "O username deve ter pelo menos 3 caracteres";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Email inválido";
      case "password":
        return value.length >= 6 ? "" : "Senha deve ter pelo menos 6 caracteres";
      case "n_processo":
        return /^[0-9]+$/.test(value) ? "" : "Número de processo deve conter apenas números";
      case "telefone":
        return /^\d{9,15}$/.test(value.replace(/\D/g, ""))
          ? ""
          : "Telefone inválido";
      default:
        return "";
    }
  };

  const [errosCampos, setErrosCampos] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Máscara simples para telefone
    let valor = value;
    if (name === "telefone") {
      valor = value.replace(/\D/g, "");
    }

    setForm({ ...form, [name]: valor });

    const erroCampo = validarCampo(name, valor);
    setErrosCampos({ ...errosCampos, [name]: erroCampo });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    // Verifica se há erros antes de enviar
    const errosExistentes = Object.values(errosCampos).filter((e) => e);
    if (errosExistentes.length > 0) {
      setErro(errosExistentes.join(" | "));
      return;
    }

    // Campos obrigatórios
    if (!form.username || !form.email || !form.password || !form.n_processo) {
      setErro("Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/accounts/registar-aluno/", form);

      setMensagem("Cadastro realizado com sucesso! Você já pode fazer login.");
      setForm({
        username: "",
        email: "",
        password: "",
        n_processo: "",
        curso: "",
        classe: "",
        data_nascimento: "",
        telefone: "",
      });
      setErrosCampos({});
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
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Cadastro de Estudante</h1>

        {mensagem && <p className="text-green-600 text-center">{mensagem}</p>}
        {erro && <p className="text-red-600 text-center">{erro}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username *"
          value={form.username}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errosCampos.username && "border-red-500"}`}
          required
        />
        {errosCampos.username && <p className="text-red-500 text-sm">{errosCampos.username}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={form.email}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errosCampos.email && "border-red-500"}`}
          required
        />
        {errosCampos.email && <p className="text-red-500 text-sm">{errosCampos.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Senha *"
          value={form.password}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errosCampos.password && "border-red-500"}`}
          required
        />
        {errosCampos.password && <p className="text-red-500 text-sm">{errosCampos.password}</p>}

        <input
          type="text"
          name="n_processo"
          placeholder="Número de Processo *"
          value={form.n_processo}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errosCampos.n_processo && "border-red-500"}`}
          required
        />
        {errosCampos.n_processo && <p className="text-red-500 text-sm">{errosCampos.n_processo}</p>}

        <input
          type="text"
          name="curso"
          placeholder="Curso"
          value={form.curso}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="classe"
          placeholder="Classe"
          value={form.classe}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          name="data_nascimento"
          placeholder="Data de Nascimento"
          value={form.data_nascimento}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="tel"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          className={`border p-2 rounded w-full ${errosCampos.telefone && "border-red-500"}`}
        />
        {errosCampos.telefone && <p className="text-red-500 text-sm">{errosCampos.telefone}</p>}

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
