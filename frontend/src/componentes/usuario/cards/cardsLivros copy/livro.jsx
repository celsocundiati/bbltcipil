import { motion } from "framer-motion";
import { MdPersonOutline } from "react-icons/md";
import { IoCalendarClearOutline } from "react-icons/io5";
import Estado from "../../estiloEstado/estado";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../service/api/api";
import { FiFilter, FiChevronDown, FiChevronUp  } from "react-icons/fi";
import {FiSearch} from "react-icons/fi";

function CardLivroCatalogo() {
  const [livros, setLivros] = useState([]);
  const navigate = useNavigate();
  const [mostrarFiltro, setMostrarFiltros] = useState(true)

  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  useEffect(() => {

    const fetchLivros = async () => {
      try {
        const params = {};
        if (search) params.search = search;
        if (estadoFilter) params.estado = estadoFilter;

        const res = await api.get("livros/livros/", {params});
        const data = Array.isArray(res.data.results) ? res.data.results : res.data;
        setLivros(data);
      } catch (err) {
        console.error("Erro ao capturar livros", err);
        if (err.response?.status === 401) navigate("/login");
      }
    };

    fetchLivros();
  }, [navigate, search, estadoFilter]);

  

  return (
    <motion.main
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        >

        <div className="px-5">
          <section className="py-10 px-5 bg-white rounded-xl border border-[#000000]/15">  
              <div className="mb-5">
                <div className="w-full">
                    <div className="flex items-center border rounded-xl overflow-hiddenmax-w-md text-[#000000]/57
                        relative focus-within:ring-2 focus-within:ring-[#f97b17] border-[#E6E6E6] transition
                    ">
                        <button className="h-full rounded-l-lg px-2 py-2 hover:text-[#f97b17] transition cursor-pointer"> <FiSearch size={22}/> </button>
        
                        <input type="text" placeholder="Pesquisar por titulo, autor e categoria..."
                        className="flex-1 px-4 py-2.5 bg-white/17 outline-none
                        " value={search} onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                </div>
              </div>

              <div>
                <button onClick={() => setMostrarFiltros(prev => !prev)}
                  className="flex text-[#f97b17] text-sm ms-2 items-center overflow-hidden transition-all duration-300">
                    
                  <FiFilter size={22} />
                  <span className="text-base cursor-pointer">
                      {mostrarFiltro ? "Ocultar filtros" : "Mostrar filtros"}
                  </span>
                  {mostrarFiltro ? <FiChevronUp /> : <FiChevronDown />}

                </button>

                {mostrarFiltro && (
                  <>
                      <hr className="text-[#000000]/17 my-3" />

                      <div className="flex justify-between gap-5 pt-5 flex-col lg:flex-row">
                          <select
                            value={estadoFilter}
                            onChange={(e) => setEstadoFilter(e.target.value)}
                            className="
                            w-full
                            px-3
                            h-10
                            rounded-xl cursor-pointer
                            border border-black/10
                            bg-white
                            text-sm
                            focus:ring-2 focus:ring-[#f97b17]
                            outline-none
                            "
                        >
                            <option value="">Todos os estados</option>
                            <option value="Disponível">Disponível</option>
                            <option value="Indisponível">Indisponível</option>
                        </select>
                      </div>
                  </>
                )}
                  
              </div>
          </section>
        </div>

        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="px-5 my-10"
            >
          
          <h2 className="py-5 text-xl text-[#000000]/57">{livros.length} Livros encontrados</h2>

          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          </section>
        </motion.section>
    </motion.main>
  );
}

export default CardLivroCatalogo;
