import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlineMail } from "react-icons/ai";
import { HiOutlineHashtag, HiOutlineLogout } from "react-icons/hi";
import { LuFilePen } from "react-icons/lu";
import ImagemUpload from "./imgPerfil";
import { useNavigate, Link } from "react-router-dom";

import ModalEditarPerfil from "../../../layout/modais/modaleditarperfil/modalperfilaluno";
import { useAuth } from "../../../auth/userAuth/useAuth";

export default function MeuPerfil() {

  const { user, logout } = useAuth(); // usa o logout do AuthContext
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log("Erro no logout", error);
    }
  };

  if (!user) {
    return <div className="p-10 text-center">Carregando perfil...</div>;
  }

  const perfil = user?.perfil?.tipo || null;
  const info = user?.dados_oficiais || {};
  const priv = user?.user || {};

  const nome = priv?.first_name;

  const subtitulo =
    perfil === "aluno" ? info?.curso
    : perfil === "funcionario" ? `Nº Agente: ${info?.n_agente}`
    : priv?.grupos?.join(", ");

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-w-sm"
    >
      {/* Banner e imagem */}
      <section className="relative">
        <article className="bg-[#F86417] h-32 rounded-t-2xl"></article>
        <ImagemUpload />
      </section>

      {/* Card do perfil */}
      <div className="w-full bg-white border border-black/17 rounded-b-2xl py-8 pt-14 px-4">

        <section className="flex flex-col gap-2">

          {/* Nome e subtitulo */}
          <div>
            <p className="font-medium text-lg">{nome || user?.user?.username}</p>
            <p className="text-[#000000]/57 text-sm">{subtitulo || "Sem informação adicional"}</p>
          </div>

          {/* Email, Telefone, Nº processo / Bilhete */}
          <div className="flex flex-col gap-2 py-1">

            <span className="flex items-center gap-2">
              <AiOutlineMail size={18} className="text-[#F97B17]" />
              <p className="text-[#000000]/57 text-sm">{priv?.email || "Sem email"}</p>
            </span>

            <span className="flex items-center gap-2">
              <HiOutlineHashtag size={18} className="text-[#F97B17]" />
              <p className="text-[#000000]/57 text-sm">
                {perfil === "aluno" && <>Nº Processo: {info?.n_processo || "N/A"}</>}
                {perfil === "funcionario" && <>Bilhete: {info?.n_bilhete || "N/A"}</>}
                {!perfil && <>Username: {priv?.username}</>}
              </p>
            </span>

            {perfil && info?.telefone && (
              <span className="flex items-center gap-2">
                <HiOutlineHashtag size={18} className="text-[#F97B17]" />
                <p className="text-[#000000]/57 text-sm">Telefone: {info?.telefone || "N/A"}</p>
              </span>
            )}

          </div>

          {/* Estatísticas */}
          <div className="flex justify-between mx-auto gap-10 py-3">
            <div className="flex flex-col bg-[#F97B17]/10 text-[#F86417] font-medium py-3 px-6 rounded-lg">
              <label className="text-center">{user?.perfil?.n_reservas ?? 0}</label>
              <label className="text-[#000000]/57 text-sm">Reservado</label>
            </div>

            <div className="flex flex-col bg-[#F97B17]/10 text-[#F86417] font-medium py-3 px-6 rounded-lg">
              <label className="text-center">{user?.perfil?.n_emprestimos ?? 0}</label>
              <label className="text-[#000000]/57 text-sm">Emprestado</label>
            </div>
          </div>

          {/* Botões */}
          <div className="space-y-3">

            {perfil && (
              <Link to="/privacidade"
                // onClick={() => setShowModal(true)}
                className="w-full bg-[#F86417] text-white flex items-center gap-2 py-3 justify-center rounded-lg cursor-pointer"
              >
                <LuFilePen size={20} />
                <p>Editar Perfil</p>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full border border-[#000000]/30 flex items-center gap-2 justify-center rounded-lg py-3 cursor-pointer"
            >
              <HiOutlineLogout size={20} />
              <p>Sair</p>
            </button>

          </div>

        </section>

        {/* Modal */}
        {showModal && perfil && (
          <ModalEditarPerfil
            form={info}
            tipo={perfil}
            onClose={() => setShowModal(false)}
          />
        )}

      </div>

    </motion.main>
  );
}