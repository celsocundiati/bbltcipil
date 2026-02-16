import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { AiOutlineFileText, AiOutlineBook } from "react-icons/ai";
import { MdPersonOutline } from "react-icons/md";
import { LuBookOpen } from "react-icons/lu";
import { HiOutlineHashtag } from "react-icons/hi";
import { IoCalendarClearOutline } from "react-icons/io5";
import EstadoDetalhes from "./estadoDetalhes/estado";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

function Detalhes() {
  const { id } = useParams();

  const [livros, setLivros] = useState([]);
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);

  // Captura todos os livros
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/livros/")
      .then((res) => setLivros(Array.isArray(res.data.results) ? res.data.results : res.data))
      .catch((err) => console.error("Erro ao capturar livros", err))
      .finally(() => setLoading(false));
  }, []);

  // Captura o aluno (atual: hardcoded id=1, depois trocar para logado)
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/alunos/71284")
      .then((res) => setAluno(res.data))
      .catch((err) => console.error("Erro ao capturar aluno", err));
  }, []);

  if (loading) return <p className="text-center mt-10">Carregando detalhes do livro...</p>;

  const livro = livros.find((livro) => livro.id === Number(id));
  if (!livro)
    return (
      <div className="w-full flex justify-center items-center mt-20">
        <p className="text-red-600 text-lg font-semibold">Nenhum livro encontrado.</p>
      </div>
    );

  // Define estilo do botão
  function btnEstilo(texto) {
    const status = texto.toLowerCase();
    const base = "h-14 rounded-xl p-1.5 font-medium";
    return status === "disponível" ? `${base} bg-[#F86417] cursor-pointer text-white` : `${base} bg-black/13 text-black/30 cursor-not-allowed`;
  }

  // Label do botão
  const btnLabel = () => {
    switch (livro.estado_atual.toLowerCase()) {
      case "disponível":
        return "Reservar Livro";
      case "emprestado":
        return "Empréstimo concluída";
      case "pendente":
        return "Aguardando aprovação";
      case "indisponível":
      case "reservado":
        return "Pronta para empréstimo";
      default:
        return "";
    }
  };

  // Função para reservar livro
  const handleReservar = async (aluno, livro) => {
    if (!aluno) {
      alert("Aluno não encontrado ou não logado.");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/api/reservas/", {
        aluno: aluno.n_processo ,
        livro: livro.id,
      });
      alert("Reserva realizada com sucesso!");
    } catch (error) {
        if (error.response) {
        console.error("Erro do backend:", error.response.data);
        alert("Erro: " + JSON.stringify(error.response.data));
        } else {
        console.error("Erro desconhecido:", error);
        alert("Erro ao fazer a reserva.");
        }
    }
  };

  // Renderiza o sumário, quebrando linhas se necessário
  const renderSumario = () => {
    if (!livro.sumario) return <p className="text-black/70">Sem sumário disponível.</p>;
    return livro.sumario.split("\n").map((linha, idx) => (
      <li key={idx} className="text-black/70 text-base">
        {linha}
      </li>
    ));
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full h-full py-15 px-5 space-y-10"
    >
      <div className="flex items-center gap-3">
        <Link to="/catalogo">
          <FiArrowLeft size={30} />
        </Link>
        <h1 className="text-xl font-semibold">Voltar ao Catálogo</h1>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-[auto_1fr] w-full h-full gap-5">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white overflow-hidden rounded-2xl max-h-150 sm:max-w-100 border border-black/10"
        >
          <img src={livro.capa} alt={livro.titulo} className="h-96 w-full object-cover" />

          <div className="p-5 w-full flex flex-col gap-5 my-3">
            <EstadoDetalhes estado={livro.estado_atual} label={livro.informacao_atual} />
            <button
              disabled={livro.estado_atual.toLowerCase() !== "disponível"}
              onClick={() => handleReservar(aluno, livro)}
              className={btnEstilo(livro.estado_atual)}
            >
              {/* {btnLabel()} */}
              {livro.informacao_atual}
            </button>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-rows space-y-10"
        >
          <div className="space-y-10 bg-white p-5 rounded-2xl border border-black/10">
            <h1 className="text-2xl pt-4 font-semibold">{livro.titulo}</h1>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-5">
                <label className="flex items-center gap-3">
                  <MdPersonOutline size={40} className="bg-[#F86417]/10 rounded-sm p-1.5 text-[#F86417] px-1" />
                  <span>
                    <p className="text-base text-black/70">Autor</p>
                    <p>{livro.autor_nome}</p>
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <LuBookOpen size={40} className="bg-[#F86417]/10 rounded-sm p-1.5 text-[#F86417] px-1" />
                  <span>
                    <p className="text-base text-black/70">Categória</p>
                    <p>{livro.categoria_nome}</p>
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <HiOutlineHashtag size={40} className="bg-[#F86417]/10 rounded-sm p-1.5 text-[#F86417] px-1" />
                  <span>
                    <p className="text-base text-black/70">ISBN</p>
                    <p>{livro.isbn}</p>
                  </span>
                </label>
              </div>

              <div className="space-y-5">
                <label className="flex items-center gap-3">
                  <IoCalendarClearOutline size={40} className="bg-[#F86417]/10 rounded-sm p-1.5 text-[#F86417] px-1" />
                  <span>
                    <p className="text-base text-black/70">Ano de publicação</p>
                    <p>{livro.publicado_em}</p>
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <AiOutlineFileText size={40} className="bg-[#F86417]/10 rounded-sm p-1.5 text-[#F86417] px-1" />
                  <span>
                    <p className="text-base text-black/70">Páginas</p>
                    <p>{livro.n_paginas}</p>
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <AiOutlineBook size={40} className="bg-[#F86417]/10 rounded-sm p-1.5 text-[#F86417] px-1" />
                  <span>
                    <p className="text-base text-black/70">Editora</p>
                    <p>{livro.editora}</p>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-white p-5 rounded-2xl border border-black/10">
            <h1 className="text-2xl font-semibold">Descrição</h1>
            <article>
              <p className="text-black/70 text-base">{livro.descricao}</p>
            </article>
          </div>

          <div className="space-y-4 bg-white p-5 rounded-2xl border border-black/10">
            <h1 className="text-2xl font-semibold">Sumário</h1>
            <article>
              <ul>{renderSumario()}</ul>
            </article>
          </div>
        </motion.article>
      </section>
    </motion.main>
  );
}

export default Detalhes;
