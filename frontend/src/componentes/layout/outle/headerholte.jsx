import {MdPersonOutline} from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import {HiOutlineArrowDownTray, HiOutlineCog6Tooth} from "react-icons/hi2";
import { useState } from "react";
import Modal from "../modais/modal";
import ModalLivro from "../modais/modalgestao/modallivro";
import ModalAluno from "../modais/modalaluno/modalaluno";
import {Link} from "react-router-dom";


function HeaderOutle({page}){

    // flex justify-between p-5
    
    const [showModal, setShowModal] = useState(false);
    const [showModalEmprest, setShowModalEmprest] = useState(false);
    const [showModalReserva, setShowModalReserva] = useState(false);
    const [showModalEstudante, setShowModalEstudante] = useState(false);
    const [showModalDevol, setShowModalDevol] = useState(false);
    const [showModalAdmin, setShowModalAdmin] = useState(false);
    const [showModalMulta, setShowModalMulta] = useState(false);

    
    function handleClick() {
        console.log("Eu sou o BBV");
        setShowModal(true);
    }
    function handleClick2(){
        setShowModalEmprest(true);
    }
    function handleClick3(){
        setShowModalEstudante(true);
    }
    function handleClick4(){
        setShowModalDevol(true);
    }
    function handleClick5(){
        setShowModalAdmin(true);
    }
    function handleClick6(){
        setShowModalMulta(true);
    }
    function handleClick7(){
        setShowModalReserva(true);
    }

    return(
        <main>
            {page === "gestaolivro" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <article className="space-y-2">
                        <h1 className="text-2xl font-medium">Gestão de Livros</h1>
                        <p className="text-black/70 text-lg">Gerir catálogo completo da biblioteca</p>
                    </article>
                    {/* <Link to="/admin/addlivro" className="bg-[#F86417] text-white px-4 py-2 text-lg cursor-pointer rounded-lg">+ Adicionar Livro</Link> */}
                </section>
            ) : page === "estudantes" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <article className="space-y-2">  
                        <h1 className="text-2xl font-medium">Gestão de Estudantes</h1>
                        <p className="text-black/70 text-lg">Gerir estudantes registados na biblioteca</p>
                    </article>
                    <button onClick={handleClick3} className="flex items-center bg-[#F86417] text-white px-4 py-2 text-lg cursor-pointer rounded-lg">
                        <MdPersonOutline size={25}/> + Adicionar Estudante
                    </button>
                </section>
            ) : page === "emprestimos" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <article className="space-y-2">
                        <h1 className="text-2xl font-medium">Gestão de Empréstimos</h1>
                        <p className="text-black/70 text-lg">Gerir e acompanhar empréstimos de livros</p>
                    </article>
                    {/* <article className="flex gap-5">
                        <button onClick={handleClick4} className="flex gap-2 items-center bg-white border border-black/15 cursor-pointer px-4 py-1.5 text-lg rounded-lg">
                            <FiCheckCircle size={25}/> Registar Devolução
                        </button>
                        <button onClick={handleClick2} className="bg-[#F86417] text-white px-4 h-10 text-lg rounded-lg cursor-pointer">
                            + Novo Empréstimo
                        </button>
                    </article> */}
                </section>  
            ) : page === "reservas" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <article className="space-y-2">
                        <h1 className="text-2xl font-medium">Gestão de Reservas</h1>
                        <p className="text-black/70 text-lg">Gerir e acompanhar reservas de livros</p>
                    </article>
                    
                    {/* <article className="flex gap-5">
                        <button onClick={handleClick7} className="bg-[#F86417] text-white px-4 h-10 text-lg rounded-lg cursor-pointer">
                            + Nova Reserva
                        </button>
                    </article> */}
                </section>  
            ) : page === "categoriasautores" ?(
                <section className="space-y-2 mt-30 flex-wrap">
                    <h1 className="text-2xl font-medium">Gestão de Livros Categórias & Autores</h1>
                    <p className="text-black/70 text-lg">Gerir categórias de livros e autores</p>
                </section>
            ) : page === "dashboard" ?(
                <section className="space-y-2 mt-30 flex-wrap">
                    <h1 className="text-2xl font-medium">Dashborad</h1>
                    <p className="text-black/70 text-lg">Visão geral do sistema da biblioteca</p>
                </section>
            ) : page === "relatorios" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <section className="space-y-2">
                        <h1 className="text-2xl font-medium">Relatórios</h1>
                        <p className="text-black/70 text-lg">Analisa detalhadamente as actividades da biblioteca</p>
                    </section>
                    <button className="flex items-center bg-[#F86417] text-white px-4 h-10 text-lg rounded-lg gap-2 cursor-pointer">
                        <HiOutlineArrowDownTray size={25}/> Exportar Relatórios
                    </button>
                </section>
            ) : page === "configuracoes" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <article className="space-y-2">
                        <h1 className="text-2xl font-medium">Configurações</h1>
                        <p className="text-black/70 text-lg">Gerir configurações gerais da biblioteca</p>
                    </article>
                </section>
            ) : page === "admins" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <article className="space-y-2">
                        <h1 className="text-2xl font-medium">Gestão de Administradores</h1>
                        <p className="text-black/70 text-lg">Gerir equipes e permissões</p>
                    </article>
                    <button onClick={handleClick5} className="flex items-center bg-[#F86417] text-white px-4 h-10 text-lg cursor-pointer rounded-lg">
                    <MdPersonOutline size={25}/> + Adicionar Admin
                    </button>
                </section>
            ) : page === "multas" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <article className="space-y-2">
                        <h1 className="text-2xl font-medium">Gestão de Multas</h1>
                        <p className="text-black/70 text-lg">Gerir multas e configurar regras.</p>
                    </article>
                    <button onClick={handleClick6} className="flex items-center bg-[#F86417] text-white px-4 h-10 text-lg cursor-pointer rounded-lg gap-2">
                        <HiOutlineCog6Tooth size={25}/> Configurar Regras
                    </button>
                </section>

            ) : (
                null
            )}
            
            {showModal && <ModalLivro onClose={() => setShowModal(false)}/> }
            {showModalEmprest && <Modal tipo="emprestimo" onClose={() => setShowModalEmprest(false)}/> }
            {showModalReserva && <Modal tipo="reserva" onClose={() => setShowModalReserva(false)}/> }
            {showModalEstudante && <ModalAluno  onClose={() => setShowModalEstudante(false)}/> }
            {showModalDevol && <Modal tipo="devoluicao" onClose={() => setShowModalDevol(false)}/> }
            {showModalAdmin && <Modal tipo="admins" onClose={() => setShowModalAdmin(false)}/> }
            {showModalMulta && <Modal tipo="multas" onClose={() => setShowModalMulta(false)}/> }
        </main>
    );
}
export default HeaderOutle;
