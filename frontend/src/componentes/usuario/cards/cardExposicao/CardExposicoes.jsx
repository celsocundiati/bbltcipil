// import { LuClock } from "react-icons/lu";
// import { IoCalendarClearOutline } from "react-icons/io5";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import api from "../../../service/api/api";
// import Skeleton from "../../../layout/motion/skeleton/skeleton";

// function CardExposicoes() {
//     const [exposicoes, setExposicoes] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [modal, setModal] = useState({
//         open: false,
//         type: "success",
//         message: "",
//     });

//     const carregarExposicoes = async () => {
//         try {
//             const res = await api.get("/livros/exposicoes/?ativas=true");
//             setExposicoes(res.data);
//         } catch (error) {
//             console.error("Erro na captura:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         carregarExposicoes();
//     }, []);

//     const reservar = async (id) => {
//         try {
//             await api.post(`/livros/exposicoes/${id}/reservar/`);

//             setModal({
//                 open: true,
//                 type: "success",
//                 message: "Exposição reservada com sucesso!",
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
//             {exposicoes.map((expo) => (
//                 <div
//                     key={expo.id}
//                     className="flex flex-col w-full bg-white border border-black/10 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition"
//                 >
//                     {/* IMAGEM */}
//                     <div className="relative w-full">
//                         <img
//                             src={expo.capa}
//                             alt={expo.titulo}
//                             className="w-full max-h-72 object-cover hover:brightness-110 transition"
//                             loading="lazy"
//                         />

//                         <span className="absolute top-4 left-4 bg-blue-100 px-4 py-1 rounded-2xl text-[#f97b17] font-semibold">
//                             Destaque
//                         </span>
//                     </div>

//                     {/* CONTEÚDO */}
//                     <div className="flex flex-col gap-2 py-5 px-5">
//                         <h1 className="text-2xl">{expo.titulo}</h1>

//                         <p className="text-black/60">{expo.descricao}</p>

//                         <div className="flex flex-col gap-2 mt-2">
//                             <div className="flex items-center gap-2 text-black/80">
//                                 <IoCalendarClearOutline size={18} />
//                                 <p>{expo.data_inicio}</p>
//                             </div>

//                             <div className="flex items-center gap-2 text-black/80">
//                                 <LuClock size={18} />
//                                 <p>{expo.local}</p>
//                             </div>
//                         </div>

//                         {/* AÇÕES */}
//                         <div className="flex gap-4 mt-3">
//                             <button
//                                 onClick={() => reservar(expo.id)}
//                                 className="flex-1 text-white py-2 rounded-lg bg-[#F97B27] hover:bg-[#F86417] transition cursor-pointer"
//                             >
//                                 Participar
//                             </button>

//                             <button className="flex-1 border border-black/10 rounded-lg hover:bg-black/10 transition cursor-pointer">
//                                 Cancelar Inscrição
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </motion.div>
//     );
// }

// export default CardExposicoes;


import { LuClock } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../../service/api/api";
import Skeleton from "../../../layout/motion/skeleton/skeleton";

function CardExposicoes() {
    const [exposicoes, setExposicoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processando, setProcessando] = useState(null);

    const [modal, setModal] = useState({
        open: false,
        type: "success",
        message: "",
    });

    const carregarExposicoes = async () => {
        try {
            const res = await api.get("/livros/exposicoes/?ativas=true");
            setExposicoes(res.data);
        } catch (error) {
            console.error("Erro na captura:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarExposicoes();
    }, []);

    // RESERVAR
    const reservar = async (id) => {
        if (processando === id) return;

        try {
            setProcessando(id);

            await api.post(`/livros/exposicoes/${id}/reservar/`);

            setExposicoes((prev) =>
                prev.map((expo) =>
                    expo.id === id
                        ? { ...expo, inscrito: true }
                        : expo
                )
            );

            setModal({
                open: true,
                type: "success",
                message: "Exposição reservada com sucesso!",
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

            await api.post(`/livros/exposicoes/${id}/cancelar_reserva/`);

            setExposicoes((prev) =>
                prev.map((expo) =>
                    expo.id === id
                        ? { ...expo, inscrito: false }
                        : expo
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
            {exposicoes.map((expo) => (
                <div
                    key={expo.id}
                    className="flex flex-col w-full bg-white border border-black/10 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                    {/* IMAGEM */}
                    <div className="relative w-full">
                        <img
                            src={expo.capa}
                            alt={expo.titulo}
                            className="w-full max-h-72 object-cover hover:brightness-110 transition"
                            loading="lazy"
                        />

                        <span className="absolute top-4 left-4 bg-blue-100 px-4 py-1 rounded-2xl text-[#f97b17] font-semibold">
                            {expo.estado}
                        </span>
                    </div>

                    {/* CONTEÚDO */}
                    <div className="flex flex-col gap-2 py-5 px-5">
                        <h1 className="text-2xl">{expo.titulo}</h1>

                        <p className="text-black/60">{expo.descricao}</p>

                        <div className="flex flex-col gap-2 mt-2">
                            <div className="flex items-center gap-2 text-black/80">
                                <IoCalendarClearOutline size={18} />
                                <p>{expo.data_inicio}</p>
                            </div>

                            <div className="flex items-center gap-2 text-black/80">
                                <LuClock size={18} />
                                <p>{expo.local}</p>
                            </div>
                        </div>

                        {/* AÇÕES */}
                        <div className="flex gap-4 mt-3">

                            {/* BOTÃO PRINCIPAL */}
                            <button
                                disabled={processando === expo.id}
                                onClick={() =>
                                    expo.inscrito
                                        ? cancelar(expo.id)
                                        : reservar(expo.id)
                                }
                                className={`flex-1 text-white py-2 rounded-lg transition
                                    ${
                                        expo.inscrito
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-[#F97B27] hover:bg-[#F86417]"
                                    }
                                    ${processando === expo.id ? "opacity-70 cursor-wait" : "cursor-pointer"}
                                `}
                            >
                                {processando === expo.id
                                    ? "Processando..."
                                    : expo.inscrito
                                    ? "Cancelar Inscrição"
                                    : "Participar"}
                            </button>

                            {/* BOTÃO SECUNDÁRIO (mantido layout) */}
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

export default CardExposicoes;