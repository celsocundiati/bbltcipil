import { LuClock, LuStar } from "react-icons/lu";
import { HiOutlineTrendingUp } from "react-icons/hi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../../../service/api/api";

function Sessao02() {

  const [livros, setLivros] = useState([]);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {

    const fetchLivrosReservas = async() => {
      try{
        const [resLivros, resReservas] = await Promise.all([
          api.get("/livros/livros"),
          api.get("/livros/reservas"),
        ]);
        setLivros(Array.isArray(resLivros.data.results) ? resLivros.data.results : resLivros.data);
        setReservas(Array.isArray(resReservas.data.results) ? resReservas.data.results : resReservas.data);
      }catch(err){
        console.error("Erro ao capturar livros e reservas", err)
      }
    }

    fetchLivrosReservas()
  }, []);

  // 🔎 Métricas calculadas diretamente
  const livrosDisponiveis = livros.filter(livro => livro.estado_atual === "Disponível").length;
  const totalAcervo = livros.length;
  const minhasReservas = reservas.filter(reservas => reservas.estado !== "finalizada").length;

  const cards = [
    {
      id: 1,
      icon: HiOutlineTrendingUp,
      valor: livrosDisponiveis,
      label: "Livros Disponíveis",
    },
    {
      id: 2,
      icon: LuClock,
      valor: minhasReservas,
      label: "Minhas Reservas",
    },
    {
      id: 3,
      icon: LuStar,
      valor: totalAcervo,
      label: "Total no Acervo",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-5 py-16"
    >
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="flex gap-2 p-5 rounded-lg bg-white border border-[#000000]/20"
          >
            <div className="bg-[#f97b17]/20 p-3 rounded-lg">
              <Icon size={35} className="text-[#f97b17]" />
            </div>

            <div>
              <p className="text-2xl">{item.valor}</p>
              <p className="text-lg text-black/57">{item.label}</p>
            </div>
          </div>
        );
      })}
    </motion.section>
  );
}

export default Sessao02;
