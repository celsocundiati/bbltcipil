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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setMensagem("");

    try {
      await axios.post("http://localhost:8000/api/cadastros/", form);
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
    } catch (err) {
      console.error(err.response?.data || err);
      setErro("Erro ao realizar cadastro. Verifique os dados informados.");
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
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="n_processo"
          placeholder="Número de Processo"
          value={form.n_processo}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />
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
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </main>
  );
}

export default CadastroAluno;
