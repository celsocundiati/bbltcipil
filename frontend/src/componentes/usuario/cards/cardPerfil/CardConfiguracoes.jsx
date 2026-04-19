import { FiSettings } from "react-icons/fi";
import { motion } from "framer-motion";
import { NavLink, Link } from "react-router-dom";
import { LuBookOpen } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../service/api/api";

const configuracoes = [
  { id: 1, titulo: "Alterar Senha", descricao: "Atualize sua senha de acesso", rota: "/alterar-senha" },
  { id: 2, titulo: "Notificações", descricao: "Gerencie suas preferências de notificações", rota: "/notificacoes" },
  { id: 3, titulo: "Privacidade", descricao: "Configurações de privacidade de dados", rota: "/privacidade" },
];

function Configuracoes() {
  const [reservas, setReservas] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {

    const fetchConfiguracoes = async() => {
      try{
          const [resReservas, resEmprestimos] = await Promise.all([
            api.get("livros/reservas/"),
            api.get("livros/emprestimos/"),
          ]);
          setReservas(Array.isArray(resReservas.data.results) ? resReservas.data.results : resReservas.data);
          setEmprestimos(Array.isArray(resEmprestimos.data.results) ? resEmprestimos.data.results : resEmprestimos.data);
      }catch(err){
          console.error("Erro ao carregar dados (reservas e emprestimos).", err)
          if (err.response?.status === 401) navigate("/login");
      }
    }

    fetchConfiguracoes();

   }, [navigate]);

  // 🔎 Filtragem real baseada no backend
  const reservasAtivas = reservas.filter(r => r.estado === "reservado" || r.estado === "pendente");
  const emprestimosAtivos = emprestimos.filter(e => e.acoes !== "devolvido");

  const randomReservado = reservasAtivas.length > 0
    ? reservasAtivas[Math.floor(Math.random() * reservasAtivas.length)]
    : null;

  const randomEmprestado = emprestimosAtivos.length > 0
    ? emprestimosAtivos[Math.floor(Math.random() * emprestimosAtivos.length)]
    : null;

    if (!emprestimos) {
        return <div className="p-10 text-center">Carregando Configurações...</div>;
    }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col gap-4 w-full h-full"
    >

      {/* EMPRESTADOS */}
      <section className="bg-white px-8 py-8 rounded-lg border border-black/8">
        <section className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <LuBookOpen size={20} className="text-[#F86417]" />
            <h1 className="text-xl">Livros Emprestados</h1>
          </div>
          <NavLink to="/reservas" className="text-[#F86417]">Ver todos</NavLink>
        </section>

        {randomEmprestado && (
          <section className="mt-5">
            <article className="bg-black/3 hover:bg-black/6 rounded px-4 py-2 flex gap-3">
              <img
                src={randomEmprestado.capa}
                alt="Capa"
                className="rounded w-16 h-24"
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-sm">{randomEmprestado.livro_nome}</h1>
                <p className="text-black/57 text-sm">{randomEmprestado.autor_nome}</p>
                <div className="text-[#f97b17] flex gap-2 items-center">
                  <IoCalendarClearOutline size={18} />
                  <p className="text-sm">Devolução: {randomEmprestado.data_devolucao}</p>
                </div>
              </div>
            </article>
          </section>
        )}
      </section>

      {/* RESERVADOS */}
      <section className="bg-white px-8 py-8 rounded-lg border border-black/8">
        <section className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <IoCalendarClearOutline size={20} className="text-[#F86417]" />
            <h1 className="text-xl">Livros Reservados</h1>
          </div>
          <NavLink to="/reservas" className="text-[#F86417]">Ver todas</NavLink>
        </section>

        {randomReservado && (
          <section className="mt-5">
            <article className="bg-black/3 hover:bg-black/6 rounded px-4 py-2 flex gap-3">
              <img
                src={randomReservado.capa}
                alt="Capa"
                className="rounded w-16 h-24"
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-sm">{randomReservado.livro_nome}</h1>
                <p className="text-black/57 text-sm">{randomReservado.autor_nome}</p>
                <div className="text-[#f97b17]">
                  <p className="text-sm bg-[#f97b17]/15 px-4 py-0.5 rounded">
                    {randomReservado.estado_label}
                  </p>
                </div>
              </div>
            </article>
          </section>
        )}
      </section>

      {/* CONFIGURAÇÕES */}
      <section className="bg-white px-8 py-8 rounded-lg border border-black/8">
        <section className="flex items-center gap-2">
          <FiSettings size={20} className="text-[#F86417]" />
          <h1 className="text-xl">Configurações da Conta</h1>
        </section>

        {configuracoes.map(conf => (
          <Link to= {conf.rota} key={conf.id}>
            <section className="mt-5">
              <article className="bg-black/3 hover:bg-black/6 rounded px-4 py-2 cursor-pointer">
                <h1 className="text-lg">{conf.titulo}</h1>
                <p className="text-black/70">{conf.descricao}</p>
              </article>
            </section>
          </Link>
        ))}
      </section>

    </motion.main>
  );
}

export default Configuracoes;
