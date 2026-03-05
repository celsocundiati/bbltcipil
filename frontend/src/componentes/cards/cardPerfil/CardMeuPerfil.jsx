// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { AiOutlineMail } from "react-icons/ai";
// import { HiOutlineHashtag, HiOutlineLogout } from "react-icons/hi";
// import { LuFilePen } from "react-icons/lu";
// import ImagemUpload from "./imgPerfil";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import ModalEditarPerfil from "../../layout/modais/modaleditarperfil/modalperfilaluno";

// function MeuPerfil() {

//     const [showModal, setShowModal] = useState(false);
//     const [dados, setDados] = useState(null);
//     const navigate = useNavigate();

//     const token = sessionStorage.getItem("access_token");

//     useEffect(() => {

//         axios.get("http://localhost:8000/api/accounts/me/", {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         })
//         .then(res => {
//             setDados(res.data);
//         })
//         .catch(err => {

//             console.log("Erro ao buscar perfil", err);

//             if (err.response?.status === 401) {
//                 navigate("/login");
//             }
//         });

//     }, [navigate, token]);

//     const handleLogout = async () => {

//         try {

//             await axios.post(
//                 "http://localhost:8000/api/accounts/logout/",
//                 {},
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//         } catch (error) {
//             console.log("Erro no logout");
//         }

//         sessionStorage.removeItem("access_token");
//         sessionStorage.removeItem("refresh_token");

//         navigate("/login");
//     };

//     if (!dados) {
//         return <div className="p-10 text-center">Carregando perfil...</div>;
//     }

//     const perfil = dados.perfil.tipo;
//     const info = dados.dados_oficiais;

//     const nome =
//         perfil === "aluno"
//             ? info?.nome_completo
//             : perfil === "funcionario"
//             ? info?.nome
//             : dados.user.username;

//     const subtitulo =
//         perfil === "aluno"
//             ? info?.curso
//             : perfil === "funcionario"
//             ? `Nº Agente: ${info?.n_agente}`
//             : null;

//     return (

//         <motion.main
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="min-w-sm"
//         >

//             <section className="relative">
//                 <article className="bg-[#F86417] h-32 rounded-t-2xl"></article>
//                 <ImagemUpload />
//             </section>

//             <div className="w-full bg-white border border-black/17 rounded-b-2xl py-8 pt-14 px-4">

//                 <section className="flex flex-col gap-2">

//                     <div>
//                         <p className="font-medium text-lg">
//                             {nome || "Sem nome definido"}
//                         </p>

//                         <p className="text-[#000000]/57 text-sm">
//                             {subtitulo || "Sem informação adicional"}
//                         </p>
//                     </div>

//                     <div className="flex flex-col gap-2 py-1">

//                         <span className="flex items-center gap-2">
//                             <AiOutlineMail size={18} className="text-[#F97B17]" />
//                             <p className="text-[#000000]/57 text-sm">
//                                 {dados.user.email}
//                             </p>
//                         </span>

//                         <span className="flex items-center gap-2">
//                             <HiOutlineHashtag size={18} className="text-[#F97B17]" />

//                             <p className="text-[#000000]/57 text-sm">

//                                 {perfil === "aluno" && (
//                                     <>Nº Processo: {info?.n_processo || "N/A"}</>
//                                 )}

//                                 {perfil === "funcionario" && (
//                                     <>Bilhete: {info?.n_bilhete || "N/A"}</>
//                                 )}

//                             </p>

//                         </span>

//                     </div>

//                     <div className="flex justify-between mx-auto gap-10 py-3">

//                         <div className="flex flex-col bg-[#F97B17]/10 text-[#F86417] font-medium py-3 px-6 rounded-lg">
//                             <label className="text-center">
//                                 {dados.perfil.n_reservas}
//                             </label>

//                             <label className="text-[#000000]/57 text-sm">
//                                 Reservado
//                             </label>
//                         </div>

//                         <div className="flex flex-col bg-[#F97B17]/10 text-[#F86417] font-medium py-3 px-6 rounded-lg">

//                             <label className="text-center">
//                                 {dados.perfil.n_emprestimos}
//                             </label>

//                             <label className="text-[#000000]/57 text-sm">
//                                 Emprestado
//                             </label>

//                         </div>

//                     </div>

//                     <div className="space-y-3">

//                         <button
//                             onClick={() => setShowModal(true)}
//                             className="w-full bg-[#F86417] text-white flex items-center gap-2 py-3 justify-center rounded-lg"
//                         >
//                             <LuFilePen size={20} />
//                             <p>Editar Perfil</p>
//                         </button>

//                         <button
//                             onClick={handleLogout}
//                             className="w-full border border-[#000000]/30 flex items-center gap-2 justify-center rounded-lg py-3"
//                         >
//                             <HiOutlineLogout size={20} />
//                             <p>Sair</p>
//                         </button>

//                     </div>

//                 </section>

//                 {showModal && (
//                     <ModalEditarPerfil
//                         form={info}
//                         tipo={perfil}
//                         onClose={() => setShowModal(false)}
//                     />
//                 )}

//             </div>

//         </motion.main>
//     );
// }

// export default MeuPerfil;


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlineMail } from "react-icons/ai";
import { HiOutlineHashtag, HiOutlineLogout } from "react-icons/hi";
import { LuFilePen } from "react-icons/lu";
import ImagemUpload from "./imgPerfil";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalEditarPerfil from "../../layout/modais/modaleditarperfil/modalperfilaluno";

function MeuPerfil() {

    const [showModal, setShowModal] = useState(false);
    const [dados, setDados] = useState(null);
    const navigate = useNavigate();

    const token = sessionStorage.getItem("access_token");

    useEffect(() => {

        axios.get("http://localhost:8000/api/accounts/me/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            setDados(res.data);
        })
        .catch(err => {

            console.log("Erro ao buscar perfil:", err.response?.data || err);

            if (err.response?.status === 401) {
                navigate("/login");
            }

            if (err.response?.status === 404) {
                console.log("Perfil não encontrado no backend.");
            }
        });

    }, [navigate, token]);


    const handleLogout = async () => {

        try {

            await axios.post(
                "http://localhost:8000/api/accounts/logout/",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

        } catch (error) {
            console.log("Erro no logout", error);
        }

        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");

        navigate("/login");
    };


    if (!dados) {
        return <div className="p-10 text-center">Carregando perfil...</div>;
    }

    const perfil = dados?.perfil?.tipo || null;
    const info = dados?.dados_oficiais || {};

    const nome =
        perfil === "aluno"
            ? info?.nome_completo
            : perfil === "funcionario"
            ? info?.nome
            : dados?.user?.username;

    const subtitulo =
        perfil === "aluno"
            ? info?.curso
            : perfil === "funcionario"
            ? `Nº Agente: ${info?.n_agente}`
            : dados?.user?.grupos?.join(", ");

    return (

        <motion.main
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="min-w-sm"
        >

            <section className="relative">
                <article className="bg-[#F86417] h-32 rounded-t-2xl"></article>
                <ImagemUpload />
            </section>

            <div className="w-full bg-white border border-black/17 rounded-b-2xl py-8 pt-14 px-4">

                <section className="flex flex-col gap-2">

                    <div>
                        <p className="font-medium text-lg">
                            {nome || "Sem nome definido"}
                        </p>

                        <p className="text-[#000000]/57 text-sm">
                            {subtitulo || "Sem informação adicional"}
                        </p>
                    </div>


                    <div className="flex flex-col gap-2 py-1">

                        <span className="flex items-center gap-2">
                            <AiOutlineMail size={18} className="text-[#F97B17]" />
                            <p className="text-[#000000]/57 text-sm">
                                {dados?.user?.email || "Sem email"}
                            </p>
                        </span>


                        <span className="flex items-center gap-2">

                            <HiOutlineHashtag size={18} className="text-[#F97B17]" />

                            <p className="text-[#000000]/57 text-sm">

                                {perfil === "aluno" && (
                                    <>Nº Processo: {info?.n_processo || "N/A"}</>
                                )}

                                {perfil === "funcionario" ? (
                                    <>Bilhete: {info?.n_bilhete || "N/A"}</>
                                ) : (
                                    <>Username: {dados?.user?.username}</>
                                )}

                                {/* {!perfil && (
                                    <>Username: {dados?.user?.username}</>
                                )} */}

                            </p>

                        </span>

                    </div>


                    <div className="flex justify-between mx-auto gap-10 py-3">

                        <div className="flex flex-col bg-[#F97B17]/10 text-[#F86417] font-medium py-3 px-6 rounded-lg">
                            <label className="text-center">
                                {dados?.perfil?.n_reservas ?? 0}
                            </label>

                            <label className="text-[#000000]/57 text-sm">
                                Reservado
                            </label>
                        </div>


                        <div className="flex flex-col bg-[#F97B17]/10 text-[#F86417] font-medium py-3 px-6 rounded-lg">

                            <label className="text-center">
                                {dados?.perfil?.n_emprestimos ?? 0}
                            </label>

                            <label className="text-[#000000]/57 text-sm">
                                Emprestado
                            </label>

                        </div>

                    </div>


                    <div className="space-y-3">

                        {perfil && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full bg-[#F86417] text-white flex items-center gap-2 py-3 justify-center rounded-lg"
                            >
                                <LuFilePen size={20} />
                                <p>Editar Perfil</p>
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="w-full border border-[#000000]/30 flex items-center gap-2 justify-center rounded-lg py-3"
                        >
                            <HiOutlineLogout size={20} />
                            <p>Sair</p>
                        </button>

                    </div>

                </section>


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

export default MeuPerfil;