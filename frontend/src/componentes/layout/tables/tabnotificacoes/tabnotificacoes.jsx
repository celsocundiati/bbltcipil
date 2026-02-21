// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function TabNotificacoes(){

//     const [reservas, setReservas] = useState([]);
//     const navigate = useNavigate();

//     const token = sessionStorage.getItem("access_token");

//     useEffect(() => {
//         if(!token){
//             navigate("/login")
//             return;
//         }
//         axios.get("http://localhost:8000/api/reservas/", {
//             headers: {Authorization: `${token}`},
//         })
//         .then(res => {
//             const data = Array.isArray(res.data.results)
//                 ? res.data.results
//                 : res.data;
//             setReservas(data);
//         })
//         .catch(err => console.error("Erro ao buscar reservas", err));
//     }, [navigate, token]);

//     const handleRedirect = (id) => {
//         navigate(`/admin/acervo#reserva-${id}`); 
//     };

//     return (
//         <main>
//             <section className="w-full h-full grid grid-cols-1 md:grid-cols-1 gap-5 mb-15">
//                 <section className="mb-5">
//                     <span className="text-black/70">
//                         Total: {reservas.length}
//                     </span>
//                 </section>

//                 <section className="w-full">
//                     <div className="w-full grid grid-cols-1 gap-5">
//                         {reservas.length === 0 ? (
//                             <div className="text-center py-4 text-red-700 bg-white border border-black/10 rounded-lg p-5">
//                                 Nenhuma reserva encontrada.
//                             </div>
//                         ) : (
//                             [...reservas]
//                                 .sort((a, b) => b.id - a.id)
//                                 .map((reserva) => (
//                                     <div 
//                                         key={`reserva-${reserva.id}`} 
//                                         onClick={() => handleRedirect(reserva.id)} 
//                                         className="w-full bg-white border border-black/10 rounded-lg p-5 hover:bg-black/5 transition-colors cursor-pointer"
//                                     >
//                                         <div className="flex items-center gap-2 mb-2">
//                                             <div className="w-2.5 h-2.5 bg-[#F97B17] rounded-full"></div>
//                                             <span className="text-lg">Reserva solicitada</span>
//                                         </div>
                                        
//                                         <div className="px-5">
//                                             <p className="text-black/70">{reserva.aluno_nome} - {reserva.livro_nome}</p>
//                                             <div className="flex flex-col text-black/70">
//                                                 <span className="text-lg">{reserva?.data_formatada} - {reserva?.hora_formatada}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                         )}
//                     </div>
//                 </section>
                
//             </section>
//         </main>
//     );
// }
// export default TabNotificacoes;

import { useState, useEffect } from "react";
import axios from "axios";

function ListaNotificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8000/api/notificacoes/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotificacoes(res.data))
      .catch((err) => console.error("Erro ao buscar notificações:", err))
      .finally(() => setLoading(false));
  }, [token]);

  const marcarLida = (id) => {
    axios
      .post(`http://localhost:8000/api/notificacoes/${id}/marcar_lida/`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setNotificacoes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
        );
      });
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-16 text-gray-500 text-lg">
        Carregando notificações...
      </div>
    );
  }

  if (notificacoes.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto py-16 px-6 text-center bg-gray-50 border border-gray-200 rounded-xl shadow-sm text-gray-600">
        Nenhuma notificação encontrada.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-6 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Notificações</h2>
      {notificacoes.map((notif) => (
        <div
          key={notif.id}
          onClick={() => {
            if (!notif.lida) marcarLida(notif.id);
            if (notif.link) window.location.href = notif.link;
          }}
          className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer shadow-sm
            ${notif.lida
              ? "bg-gray-50 border-gray-200 text-gray-600"
              : "bg-white border-orange-300 text-gray-800 shadow-md hover:shadow-lg hover:bg-orange-50"
            }`}
        >
          <div className="flex items-start gap-3">
            {!notif.lida && (
              <span className="w-3 h-3 mt-1 bg-orange-500 rounded-full animate-pulse" title="Nova notificação"></span>
            )}
            <div className="flex flex-col">
              <h4 className="font-semibold text-gray-800">{notif.titulo}</h4>
              {notif.descricao && (
                <p className="text-sm text-gray-500 mt-1">{notif.descricao}</p>
              )}
              <span className="text-xs text-gray-400 mt-1">
                {new Date(notif.criada_em).toLocaleString("pt-PT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          {notif.link && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

export default ListaNotificacoes;