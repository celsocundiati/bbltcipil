import { motion } from "framer-motion";
import { MdPersonOutline } from "react-icons/md";
import { IoCalendarClearOutline } from "react-icons/io5";
import Estado from "../../estiloEstado/estado";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function CardLivro() {
  const [livros, setLivros] = useState([]);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchLivros = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/livros/", {
          headers: { Authorization: `Bearer ${token}` }, // ⚡ Corrigido: era "Authentization" -> "Authorization"
        });
        const data = Array.isArray(res.data.results) ? res.data.results : res.data;
        setLivros(data);
      } catch (err) {
        console.error("Erro ao capturar livros", err);
        if (err.response?.status === 401) navigate("/login");
      }
    };

    fetchLivros();
  }, [navigate, token]);

  

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {livros.map((livro) => (
        <section
          key={livro.id}
          className="bg-white rounded-md shadow overflow-hidden relative hover:scale-105 duration-300 ease-in-out transition-transform cursor-pointer"
        >
          <img
            src={livro.capa}
            alt={livro.livro_nome || livro.titulo}
            className="w-full h-60 object-cover"
            loading="lazy"
          />

          <Estado estado={livro.estado_label || livro.estado_atual} />

          <section className="p-3">
            <p className="font-medium text-sm">{livro.livro_nome || livro.titulo}</p>
            <p className="flex gap-2 mt-2 items-center text-gray-700">
              <MdPersonOutline size={20} /> {livro.autor_nome}
            </p>
            <p className="flex gap-2 mt-2 items-center text-gray-700">
              <IoCalendarClearOutline size={20} /> {livro.data_formatada || livro.publicado_em} • {livro.categoria_nome}
            </p>
            <Link
              to={`/detalhes/${livro.id}`}
              className="bg-[#F97B17] text-white w-full mt-3 py-2 rounded-lg hover:bg-[#F96518] transition block text-center"
            >
              Ver Detalhes
            </Link>
          </section>
        </section>
      ))}
    </motion.section>
  );
}

export default CardLivro;
