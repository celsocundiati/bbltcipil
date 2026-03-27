import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../service/api/api";

function ListaNotificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10); // Limite inicial
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        const res = await api.get("livros/notificacoes/");
        setNotificacoes(Array.isArray(res.data.results) ? res.data.results : res.data);
      } catch (err) {
        console.error("Erro ao buscar notificações.", err);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchNotificacoes();
  }, [navigate]);

  const marcarLida = (id) => {
    api.post(`livros/notificacoes/${id}/marcar_lida/`, null)
      .then(() => {
        setNotificacoes(prev =>
          prev.map(n => (n.id === id ? { ...n, lida: true } : n))
        );
      })
      .catch(err => console.error("Erro ao marcar como lida:", err));
  };

  const handleRedirect = (link) => {
    navigate(link);
  };

  const handleVerMais = () => {
    setLimit(prev => prev + 10);
  };

  if (loading) return (
    <div className="w-full flex justify-center items-center py-20 text-gray-500 text-lg">
      Carregando notificações...
    </div>
  );

  if (!notificacoes.length) return (
    <div className="w-full max-w-lg mx-auto py-16 px-6 text-center bg-gray-50 border border-gray-200 rounded-2xl shadow-md text-gray-600">
      Nenhuma notificação encontrada.
    </div>
  );

  const exibidas = notificacoes.slice(0, limit);

  return (
    <div className="w-full max-w-2xl mx-auto py-6 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Notificações</h2>
      <AnimatePresence>
        {exibidas.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.12)" }}
            onClick={() => {
              if (!notif.lida) marcarLida(notif.id);
              if (notif.link) handleRedirect(notif.link);
            }}
            className={`flex items-center justify-between p-5 rounded-xl border transition-all cursor-pointer
              ${notif.lida
                ? "bg-gray-50 border-gray-200 text-gray-600"
                : "bg-linear-to-r from-orange-50 to-orange-100 border-orange-300 text-gray-800 shadow-md"
              }`}
          >
            <div className="flex items-start gap-3">
              {!notif.lida && (
                <span
                  className="w-3 h-3 mt-1 bg-orange-500 rounded-full animate-pulse"
                  title="Nova notificação"
                ></span>
              )}
              <div className="flex flex-col">
                <h4 className="font-semibold text-gray-800">{notif.titulo}</h4>
                {notif.descricao && <p className="text-sm text-gray-500 mt-1">{notif.descricao}</p>}
                <span className="text-xs text-gray-400 mt-1">
                  {new Date(notif.criada_em).toLocaleString("pt-PT", {
                    day:"2-digit", month:"2-digit", year:"numeric", 
                    hour:"2-digit", minute:"2-digit"
                  })}
                </span>
              </div>
            </div>
            {notif.link && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      {limit < notificacoes.length && (
        <button
          onClick={handleVerMais}
          className="mt-4 self-center cursor-pointer px-6 py-2 bg-orange-500 text-white font-semibold rounded-full shadow hover:bg-orange-600 transition"
        >
          Ver mais
        </button>
      )}
    </div>
  );
}

export default ListaNotificacoes;













