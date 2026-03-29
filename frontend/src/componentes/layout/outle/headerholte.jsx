import {MdPersonOutline} from "react-icons/md";
import {HiOutlineArrowDownTray, HiOutlineCurrencyDollar} from "react-icons/hi2";
import { useState } from "react";
import {Link} from "react-router-dom";
import ModalAlunoOficial from "../modais/modalalunooficial/modalalunooficial";
import ModalMultas from "../modais/modalmultas/modalmultas";
import ModalAddAdmin from "../modais/modaladminadd/addadmin";
import { podeGerir } from "../../auth/podegerir/permissao";
import { useAuth } from "../../auth/userAuth/useauth";

function HeaderOutle({page}){

    const { user } = useAuth();

    // flex justify-between p-5
    
    const [showModalEstudante, setShowModalEstudante] = useState(false);
    const [showModalAdmin, setShowModalAdmin] = useState(false);
    const [showModalMulta, setShowModalMulta] = useState(false);


    function handleClick3(){
        if (!podeGerir(user)) return;
        setShowModalEstudante(true);
    }

    function handleClick5(){
        if (!podeGerir(user)) return;
        setShowModalAdmin(true);
    }

    function handleClick6(){
        if (!podeGerir(user)) return;
        setShowModalMulta(true);
    }


    return(
        <main>
            {page === "gestaolivro" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <article className="space-y-2">
                        <h1 className="text-2xl font-medium">Gestão de Livros</h1>
                        <p className="text-black/70 text-lg">Gerir catálogo completo da biblioteca</p>
                    </article>
                    {podeGerir(user) && (
                        <Link 
                            to="/admin/addlivro" 
                            className="bg-[#F86417] text-white px-4 py-2 text-lg cursor-pointer rounded-lg"
                        >
                            + Adicionar Livro
                        </Link>
                    )}
                </section>
            ) : page === "perfil" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <article className="space-y-2">  
                        <h1 className="text-2xl font-medium">Gestão de Estudantes & Funcionários</h1>
                        <p className="text-black/70 text-lg">Gerir estudantes e funcionários registados na biblioteca</p>
                    </article>
                </section>
            ) : page === "alunosoficiais" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <article className="space-y-2">  
                        <h1 className="text-2xl font-medium">Gestão de Estudantes & Funcionários</h1>
                        <p className="text-black/70 text-lg">Gerir estudantes e funcionários registados na biblioteca</p>
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
                </section>  
            ) : page === "reservas" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <article className="space-y-2">
                        <h1 className="text-2xl font-medium">Gestão de Reservas</h1>
                        <p className="text-black/70 text-lg">Gerir e acompanhar reservas de livros</p>
                    </article>
                </section>  
            ) : page === "categoriasautores" ?(
                <section className="space-y-2 mt-30 flex-wrap">
                    <h1 className="text-2xl font-medium">Gestão de Livros Categorias & Autores</h1>
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
                    {podeGerir(user) && (
                        <button onClick={handleClick5} className="flex items-center bg-[#F86417] text-white px-4 h-10 text-lg cursor-pointer rounded-lg">
                            <MdPersonOutline size={25}/> + Adicionar Admin
                        </button>
                    )}
                </section>
            ) : page === "multas" ?(
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <article className="space-y-2">
                        <h1 className="text-2xl font-medium">Gestão de Multas</h1>
                        <p className="text-black/70 text-lg">Gerir multas e configurar regras.</p>
                    </article>
                    {podeGerir(user) && (
                        <button onClick={handleClick6} className="flex items-center bg-[#F86417] text-white px-4 h-10 text-lg cursor-pointer rounded-lg gap-2">
                            <HiOutlineCurrencyDollar size={25}/> Aplicar multa
                        </button>
                    )}
                </section>

            ) : (
                null
            )}
            
            {showModalEstudante && <ModalAlunoOficial  onClose={() => setShowModalEstudante(false)}/> }
            {showModalAdmin && <ModalAddAdmin onClose={() => setShowModalAdmin(false)}/> }
            {showModalMulta && ( <ModalMultas onClose={() => setShowModalMulta(false)}/> )}        

        </main>
    );
}
export default HeaderOutle;
