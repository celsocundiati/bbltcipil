// import { LuClock } from "react-icons/lu";
// import { IoCalendarClearOutline } from "react-icons/io5";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import api from "../../../service/api/api";
// import Skeleton from "../../../layout/motion/skeleton/skeleton";

// function CardEventos() {
//     const [eventos, setEventos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [modal, setModal] = useState({
//         open: false,
//         type: "success",
//         message: "",
//     });

//     const carregarEventos = async () => {
//         try {
//             const res = await api.get("/livros/eventos/?ativas=true");
//             setEventos(res.data);
//         } catch (error) {
//             console.error("Erro na captura:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         carregarEventos();
//     }, []);

//     const reservar = async (id) => {
//         try {
//             await api.post(`/livros/eventos/${id}/reservar/`);

//             setModal({
//                 open: true,
//                 type: "success",
//                 message: "Evento reservado com sucesso!",
//             });
//         } catch (error) {
//             const erros = error.response?.data
//                 ? Object.values(error.response.data).flat().join(" ")
//                 : "Erro ao comunicar com o servidor";

//             setModal({
//                 open: true,
//                 type: "error",
//                 message: erros,
//             });
//         }
//     };

//     if(loading) {
//         return <Skeleton type="cardexposicaoexvento" />
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="grid grid-cols-1 gap-6 w-full"
//         >
//             {eventos.map((ev) => (
//                 <div
//                     key={ev.id}
//                     className="flex flex-col w-full bg-white border border-black/10 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition"
//                 >
//                     {/* IMAGEM */}
//                     <div className="relative w-full">
//                         <img
//                             src={ev.capa}
//                             alt={ev.titulo}
//                             className="w-full max-h-72 object-cover hover:brightness-110 transition"
//                             loading="lazy"
//                         />

//                         <span className="absolute top-4 left-4 bg-blue-100 px-4 py-1 rounded-2xl text-blue-500 font-semibold">
//                             Evento
//                         </span>
//                     </div>

//                     {/* CONTEÚDO */}
//                     <div className="flex flex-col gap-2 py-5 px-5">
//                         <h1 className="text-2xl">{ev.titulo}</h1>

//                         <p className="text-black/60">{ev.descricao}</p>

//                         <div className="flex flex-col gap-2 mt-2">
//                             <div className="flex items-center gap-2 text-black/80">
//                                 <IoCalendarClearOutline size={18} />
//                                 <p>{ev.data_inicio}</p>
//                             </div>

//                             <div className="flex items-center gap-2 text-black/80">
//                                 <LuClock size={18} />
//                                 <p>{ev.local}</p>
//                             </div>
//                         </div>

//                         {/* AÇÕES */}
//                         <div className="flex gap-4 mt-3">
//                             <button
//                                 onClick={() => reservar(ev.id)}
//                                 className="flex-1 text-white py-2 rounded-lg bg-[#F97B27] hover:bg-[#F86417] transition cursor-pointer"
//                             >
//                                 Participar
//                             </button>

//                             <button className="flex-1 border border-black/10 rounded-lg hover:bg-black/10 transition cursor-pointer">
//                                 Ver Mais
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </motion.div>
//     );
// }

// export default CardEventos;



// import { LuClock } from "react-icons/lu";
// import { IoCalendarClearOutline } from "react-icons/io5";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import api from "../../../service/api/api";
// import Skeleton from "../../../layout/motion/skeleton/skeleton";

// function CardEventos() {
//     const [eventos, setEventos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [reservando, setReservando] = useState(null);

//     const [modal, setModal] = useState({
//         open: false,
//         type: "success",
//         message: "",
//     });

//     const carregarEventos = async () => {
//         try {
//             const res = await api.get("/livros/eventos/?ativas=true");
//             setEventos(res.data);
//         } catch (error) {
//             console.error("Erro na captura:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         carregarEventos();
//     }, []);

//     const reservar = async (id) => {
//         if (reservando === id) return;

//         try {
//             setReservando(id);

//             await api.post(`/livros/eventos/${id}/reservar/`);

//             setEventos((prev) =>
//                 prev.map((ev) =>
//                     ev.id === id
//                         ? { ...ev, inscrito: true }
//                         : ev
//                 )
//             );

//             setModal({
//                 open: true,
//                 type: "success",
//                 message: "Evento reservado com sucesso!",
//             });

//         } catch (error) {
//             const erros = error.response?.data
//                 ? Object.values(error.response.data).flat().join(" ")
//                 : "Erro ao comunicar com o servidor";

//             setModal({
//                 open: true,
//                 type: "error",
//                 message: erros,
//             });
//         } finally {
//             setReservando(null);
//         }
//     };

//     if (loading) {
//         return <Skeleton type="cardexposicaoexvento" />;
//     }

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="grid grid-cols-1 gap-6 w-full"
//         >
//             {eventos.map((ev) => (
//                 <div
//                     key={ev.id}
//                     className="flex flex-col w-full bg-white border border-black/10 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition"
//                 >
//                     {/* IMAGEM */}
//                     <div className="relative w-full">
//                         <img
//                             src={ev.capa}
//                             alt={ev.titulo}
//                             className="w-full max-h-72 object-cover hover:brightness-110 transition"
//                             loading="lazy"
//                         />

//                         <span className="absolute top-4 left-4 bg-blue-100 px-4 py-1 rounded-2xl text-blue-500 font-semibold">
//                             Evento
//                         </span>
//                     </div>

//                     {/* CONTEÚDO */}
//                     <div className="flex flex-col gap-2 py-5 px-5">
//                         <h1 className="text-2xl">{ev.titulo}</h1>

//                         <p className="text-black/60">{ev.descricao}</p>

//                         <div className="flex flex-col gap-2 mt-2">
//                             <div className="flex items-center gap-2 text-black/80">
//                                 <IoCalendarClearOutline size={18} />
//                                 <p>{ev.data_inicio}</p>
//                             </div>

//                             <div className="flex items-center gap-2 text-black/80">
//                                 <LuClock size={18} />
//                                 <p>{ev.local}</p>
//                             </div>
//                         </div>

//                         {/* AÇÕES */}
//                         <div className="flex gap-4 mt-3">
//                             <button
//                                 disabled={ev.inscrito || reservando === ev.id}
//                                 onClick={() => reservar(ev.id)}
//                                 className={`flex-1 text-white py-2 rounded-lg transition
//                                     ${
//                                         ev.inscrito
//                                             ? "bg-gray-400 cursor-not-allowed"
//                                             : reservando === ev.id
//                                             ? "bg-[#F97B27] cursor-wait"
//                                             : "bg-[#F97B27] hover:bg-[#F86417] cursor-pointer"
//                                     }
//                                 `}
//                             >
//                                 {
//                                     reservando === ev.id
//                                         ? "Reservando..."
//                                         : ev.inscrito
//                                         ? "Inscrito"
//                                         : "Participar"
//                                 }
//                             </button>

//                             {/* <button className="flex-1 border border-black/10 rounded-lg hover:bg-black/10 transition cursor-pointer">
//                                 Cancelar Inscrição
//                             </button> */}
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </motion.div>
//     );
// }

// export default CardEventos;


import { LuClock } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../../service/api/api";
import Skeleton from "../../../layout/motion/skeleton/skeleton";

function CardEventos() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processando, setProcessando] = useState(null);

    const [modal, setModal] = useState({
        open: false,
        type: "success",
        message: "",
    });

    const carregarEventos = async () => {
        try {
            const res = await api.get("/livros/eventos/?ativas=true");
            setEventos(res.data);
        } catch (error) {
            console.error("Erro na captura:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarEventos();
    }, []);

    // RESERVAR
    const reservar = async (id) => {
        if (processando === id) return;

        try {
            setProcessando(id);

            await api.post(`/livros/eventos/${id}/reservar/`);

            setEventos((prev) =>
                prev.map((ev) =>
                    ev.id === id
                        ? { ...ev, inscrito: true }
                        : ev
                )
            );

            setModal({
                open: true,
                type: "success",
                message: "Evento reservado com sucesso!",
            });

        } catch (error) {
            const erros = error.response?.data
                ? Object.values(error.response.data).flat().join(" ")
                : "Erro ao comunicar com o servidor";

            setModal({
                open: true,
                type: "error",
                message: erros,
            });

        } finally {
            setProcessando(null);
        }
    };

    // CANCELAR
    const cancelar = async (id) => {
        if (processando === id) return;

        try {
            setProcessando(id);

            await api.post(`/livros/eventos/${id}/cancelar_reserva/`);

            setEventos((prev) =>
                prev.map((ev) =>
                    ev.id === id
                        ? { ...ev, inscrito: false }
                        : ev
                )
            );

            setModal({
                open: true,
                type: "success",
                message: "Inscrição cancelada com sucesso!",
            });

        } catch (error) {
            const erros = error.response?.data
                ? Object.values(error.response.data).flat().join(" ")
                : "Erro ao comunicar com o servidor";

            setModal({
                open: true,
                type: "error",
                message: erros,
            });

        } finally {
            setProcessando(null);
        }
    };

    if (loading) {
        return <Skeleton type="cardexposicaoexvento" />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 gap-6 w-full"
        >
            {eventos.map((ev) => (
                <div
                    key={ev.id}
                    className="flex flex-col w-full bg-white border border-black/10 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                    {/* IMAGEM */}
                    <div className="relative w-full">
                        <img
                            src={ev.capa}
                            alt={ev.titulo}
                            className="w-full max-h-72 object-cover hover:brightness-110 transition"
                            loading="lazy"
                        />

                        <span className="absolute top-4 left-4 bg-blue-100 px-4 py-1 rounded-2xl text-blue-500 font-semibold">
                            {ev.estado}
                        </span>
                    </div>

                    {/* CONTEÚDO */}
                    <div className="flex flex-col gap-2 py-5 px-5">
                        <h1 className="text-2xl">{ev.titulo}</h1>

                        <p className="text-black/60">{ev.descricao}</p>

                        <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2 text-black/80">
                                <IoCalendarClearOutline size={18} />
                                <p>{ev.data_inicio}</p>
                            </div>

                            <div className="flex items-center gap-2 text-black/80">
                                <LuClock size={18} />
                                <p>{ev.local}</p>
                            </div>
                        </div>

                        {/* AÇÕES */}
                        <div className="flex gap-4 mt-3">

                            <button
                                disabled={processando === ev.id}
                                onClick={() =>
                                    ev.inscrito
                                        ? cancelar(ev.id)
                                        : reservar(ev.id)
                                }
                                className={`flex-1 text-white py-2 rounded-lg transition
                                    ${
                                        ev.inscrito
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-[#F97B27] hover:bg-[#F86417]"
                                    }
                                    ${processando === ev.id ? "opacity-70 cursor-wait" : "cursor-pointer"}
                                `}
                            >
                                {processando === ev.id
                                    ? "Processando..."
                                    : ev.inscrito
                                    ? "Cancelar Inscrição"
                                    : "Participar"}
                            </button>

                            {/* <button className="flex-1 border border-black/10 rounded-lg hover:bg-black/10 transition cursor-pointer">
                                Ver Mais
                            </button> */}

                        </div>
                    </div>
                </div>
            ))}
        </motion.div>
    );
}

export default CardEventos;