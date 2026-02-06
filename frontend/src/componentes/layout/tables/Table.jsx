import {livros, alunos, emprestimos, categorias, autores, admins, multas, reservas} from "../../../dados/db.json";
import { obterIniciais } from "./utilitarios/Utils";
import { LuFilePen } from "react-icons/lu";
import { FiEye, FiTrash2 } from "react-icons/fi";
import {HiOutlineFolder} from "react-icons/hi2";
import {MdPersonOutline} from "react-icons/md"

import { useState } from "react";
import BtnAddAdmin from "../btns01/btnaddmin";
import Modal from "../modais/modal";
import { rowsTableEstrato } from "./utilitarios/Utils";



function Table({tipo}){

    const totalAlunos = alunos.length;
    const alunosAtivos = alunos.filter(aluno => aluno.extra === "Ativo");
    const qtdAlunosAtivos = alunosAtivos.length;
    const alunosPendentes = alunos.filter(aluno => aluno.extra === "Pendente");
    const qtdAlunosPendentes = alunosPendentes.length;
    const alunosSuspensos = alunos.filter(aluno => aluno.extra === "Suspenso");
    const qtdAlunosSuspensos = alunosSuspensos.length;


    const emprestAtivos = emprestimos.filter(emprest => emprest.estado === "Ativo");
    const qtdemprestAtivo = emprestAtivos.length;
    const emprestAtrasados = emprestimos.filter(emprest => emprest.estado === "Atrasado");
    const qtdemprestAtrasado = emprestAtrasados.length;
    let devolucoes = 0;
    let vencimentoProximo = 0;
    
    const totalM = multas.length;
        

    const [showModalCategoria, setShowModalCategoria] = useState(false);
    const [showModalAutor, setShowModalAutor] = useState(false);
    
    function handleClick(){
        setShowModalCategoria(true);
    }
    function handleClick2(){
        setShowModalAutor(true);
    }

    return(
        <main>
            {tipo === "gestaolivro" ?(

                <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                    <section className="py-5 flex flex-col">
                        <label className="text-xl">Lista de Livros</label>
                        <label className="text-black/70">Exibindo 8 de 8 livros</label>
                    </section>

                    <section>
                        <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                            <thead className="bg-black/5">
                                <tr>
                                    <th className="w-[35%] px-5 py-3 text-left">Livro</th>
                                    <th className="w-[15%] px-5 py-3 text-left">Autor</th>
                                    <th className="w-[15%] px-5 py-3 text-left">Categoria</th>
                                    <th className="w-[5%] px-5 py-3 text-left">Nº</th>
                                    <th className="w-[10%] px-10 py-3 text-left">Ano</th>
                                    <th className="w-[10%] px-5 py-3 text-left">Estado</th>
                                    <th className="w-[15%] px-5 py-3 text-left">Ações</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-black/10">
                                {livros.map(livro => (
                                    <tr key={livro.id} className="hover:bg-black/3 transition">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={livro.capa} 
                                                    alt={livro.titulo}
                                                    className="w-14 h-20 object-cover rounded-md shrink-0"
                                                />
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="font-medium line-clamp-2">
                                                        {livro.titulo}
                                                    </span>
                                                    <span className="text-black/70 text-sm truncate">
                                                        ISBN – {livro.isbn}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 truncate text-black/85">{livro.autor}</td>
                                        <td className="px-5 py-4 truncate text-black/85">{livro.categoria}</td>
                                        <td className="px-5 py-4 truncate text-black/85">{livro.nlivro}</td>
                                        <td className="px-5 py-4 truncate text-black/85">{livro.data_publicacao}</td>

                                        <td className="px-5 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium 
                                                ${livro.estado === "Disponível" 
                                                    ? "bg-green-100 text-green-700" 
                                                    : "bg-cinza-300 text-preto-500"}`}
                                            >
                                                {livro.estado}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex gap-3">
                                                <button className="hover:text-[#f97b17] transition">
                                                    <FiEye size={20}/>
                                                </button>
                                                <button className="hover:text-[#f97b17] transition">
                                                    <LuFilePen size={20}/>
                                                </button>
                                                <button className="text-red-700 hover:text-red-900 transition">
                                                    <FiTrash2 size={20}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </section>

            ): tipo === "estudantes" ?(

            <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                <section className="py-5 flex flex-col">
                    <label className="text-xl">Lista de Estudantes</label>
                    <label className="text-black/70">Exibindo {totalAlunos} de {totalAlunos}</label>
                </section>
                    <section className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full table-fixed border-collapse">
                            <thead className="bg-black/5">
                                <tr>
                                    <th className="w-[35%] px-5 py-3 text-left">Estudante</th>
                                    <th className="w-[15%] px-5 py-3 text-left">Nº Processo</th>
                                    <th className="w-[15%] px-5 py-3 text-left">Curso</th>
                                    <th className="w-[10%] px-5 py-3 text-left">Classe</th>
                                    <th className="w-[10%] px-5 py-3 text-left">Estado</th>
                                    <th className="w-[15%] px-5 py-3 text-left">Empréstimos</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-black/10">
                                {alunos.map(aluno => (
                                    <tr key={aluno.id} className="hover:bg-black/3 transition">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-[#f97b17] text-white flex items-center justify-center font-bold shrink-0">
                                                    {obterIniciais(aluno.estudante)}
                                                </div>

                                                <div className="overflow-hidden">
                                                    <p className="font-medium truncate">
                                                        {aluno.estudante}
                                                    </p>
                                                    <p className="text-sm text-cinza-900 truncate">
                                                        {aluno.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 truncate">{aluno.n_proc}</td>
                                        <td className="px-5 py-4 truncate">{aluno.curso}</td>
                                        <td className="px-5 py-4">{aluno.classe}</td>

                                        <td className="px-5 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                                                ${aluno.extra === "Ativo"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"}`}
                                            >
                                                {aluno.extra}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="px-3 py-1 rounded-lg text-yellow-700 border border-yellow-700 text-sm">
                                                {aluno.emprestimos} livros
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </section>
                
            ) : tipo === "emprestimos" ?(
 
            <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                <section className="py-5 flex flex-col">
                    <label className="text-xl">Lista de Empréstimos</label>
                    <label className="text-black/70">Exibindo {emprestimos.length} de {emprestimos.length}</label>
                </section>
                <section className="w-full rounded-xl overflow-hidden">
                    <table className="table-auto w-full text-left bg-white shadow-md border border-black/10 rounded-xl">
                        <thead className="bg-black/5 text-cinza-900">
                            <tr>
                                <th className="py-2 px-5">Livro</th>
                                <th className="py-2 px-5">Estudante</th>
                                <th className="py-2 px-5">Data Empréstimo</th>
                                <th className="py-2 px-5">Data Vencimento</th>
                                <th className="py-2 px-5">Estado</th>
                                {/* <th className="py-2 px-5">Ações</th>
                                <th className="py-2 px-5">Ações</th> */}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-black/10">
                            {emprestimos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-red-700">
                                        Nenhum empréstimo encontrado.
                                    </td>
                                </tr>
                            ) : (
                                emprestimos.map((emprest, index) => (
                                    <tr 
                                        key={emprest.id || index} 
                                        className="hover:bg-black/3 transition-colors"
                                    >
                                        <td className="px-5 py-5">{emprest.livro}</td>
                                        <td className="px-5 py-5">{emprest.estudante}</td>
                                        <td className="px-5 py-5">{emprest.data_emprestimo}</td>
                                        <td className="px-5 py-5">{emprest.data_vencimento}</td>
                                        <td className="px-5 py-5">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                                                ${emprest.estado === "Ativo" 
                                                    ? "bg-green-100 text-green-700" 
                                                    : "bg-red-100 text-red-700"}`}>
                                                {emprest.estado}
                                            </span>
                                        </td>
                                    {/* <td className="px-5 py-5">  
                                        <button className={`px-4 py-2 rounded-lg w-full ${emprest.estado === "Ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700" }`}>
                                            {emprest.estado}
                                        </button>
                                    </td> */}
                                    {/* <td className="px-5 py-5"> {emprest.accoes} </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </section>

            </section>
            ) : tipo === "reservas" ?(
 
            <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                <section className="py-5 flex flex-col">
                    <label className="text-xl">Lista de Reservas</label>
                    <label className="text-black/70">Exibindo {reservas.length} de {reservas.length}</label>
                </section>
                <section className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full table-fixed border-collapse">
                        <thead className="bg-black/5">
                            <tr>
                                <th className="w-[25%] px-5 py-3 text-center">Livro</th>
                                <th className="w-[25%] px-5 py-3 text-center">Estudante</th>
                                <th className="w-[15%] px-5 py-3 text-center">Data Reserva</th>
                                <th className="w-[15%] px-5 py-3 text-center">Data Vencimento</th>
                                <th className="w-[10%] px-5 py-3 text-center">Estado</th>
                                <th className="w-[10%] px-5 py-3 text-center">Ações</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-black/10">
                            {reservas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-red-700">
                                        Nenhum empréstimo encontrado.
                                    </td>
                                </tr>
                            ) : (
                                reservas.map((reserva, index) => (
                                    <tr 
                                        key={reserva.id || index} 
                                        className="hover:bg-black/3 transition-colors"
                                    >
                                        <td className="px-5 py-4 truncate text-center">{reserva.livro}</td>
                                        <td className="px-5 py-4 truncate text-center">{reserva.estudante}</td>
                                        <td className="px-5 py-4 truncate text-center">{reserva.data_reserva}</td>
                                        <td className="px-5 py-4 truncate text-center">{reserva.data_vencimento}</td>
                                        <td className="px-5 py-4 truncate text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                                                ${reserva.estado === "Ativo" 
                                                    ? "bg-green-100 text-green-700" 
                                                    : "bg-yellow-100 text-yellow-700"}`}>
                                                {reserva.estado}
                                            </span>
                                        </td>
                                    {/* <td className="px-5 py-5">  
                                        <button className={`px-4 py-2 rounded-lg w-full ${emprest.estado === "Ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700" }`}>
                                            {emprest.estado}
                                        </button>
                                    </td> */}
                                    <td className="px-5 py-4 truncate text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                                                ${reserva.estado === "Ativo" 
                                                    ? "bg-green-100 text-green-700" 
                                                    : "bg-red-100 text-red-700"}`}>
                                                {reserva.accoes}
                                            </span>
                                    </td>
                                </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </section>

            </section>

            ): tipo === "categorias" ?(
                <section>
                    <div>
                        <BtnAddAdmin tipo="categoria" onClick={handleClick}/>
                    </div>
                    <div className="w-full bg-white rounded-2xl px-8 my-25 py-8">
                        <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                            <thead className="bg-black/5">
                                <tr>
                                    <th className="w-[15%] px-5 py-3 text-center">Livro</th>
                                    <th className="w-[25%] px-5 py-3 text-center">Descrição</th>
                                    <th className="w-[15%] px-5 py-3 text-center">Nº de Livro</th>
                                    <th className="w-[15%] px-5 py-3 text-center">Empréstimo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/10">
                                {categorias.map(categoria => (
                                    <tr className="hover:bg-black/3">
                                        <td className="flex items-center gap-5 px-5 py-4 truncate text-center text-black/85">
                                            <div className="flex items-center gap-5">
                                                <label className="text-[#F97B17] bg-[#F97B17]/10 p-2 rounded-xl"> <HiOutlineFolder size={30}/> </label>
                                                <label>{categoria.categoria} </label>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 truncate text-center text-black/85"> {categoria.descricao} </td>
                                        <td className="px-5 py-4 truncate text-center text-black/85"> {categoria.n_livros} </td>
                                        <td className="px-5 py-4 truncate text-center text-black/85">
                                            <div className="flex gap-2 items-center justify-center">
                                                <button> <LuFilePen size={30}/> </button>
                                                <button> <FiTrash2 size={30} className="text-red-700"/> </button>
                                            </div>
                                        </td>
                                                    
                                    </tr>
                                ))}
                            </tbody>
                    </table>
                    </div>
                </section>
            ) : tipo === "autores" ?(
                <section>
                    <div>
                        <BtnAddAdmin tipo="autor" onClick={handleClick2}/>
                    </div>
                    <div className="w-full bg-white rounded-2xl px-8 my-25 py-8">
                        <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                            <thead className="bg-black/5">
                                <tr>
                                    <th className="w-[15%] px-5 py-3 text-center">Autor</th>
                                    <th  className="w-[25%] px-5 py-3 text-center">Nacionalidade</th>
                                    <th className="w-[15%] px-5 py-3 text-center">Nº de Livro</th>
                                    <th className="w-[15%] px-5 py-3 text-center">Empréstimo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/10">
                                {autores.map(autor => (
                                    <tr className="hover:bg-black/3">
                                        <td className="flex items-center gap-5 px-5 py-4 truncate text-center text-black/85">
                                            <div className="flex items-center gap-5">
                                                <label className="text-[#F97B17] bg-[#F97B17]/10 p-2 rounded-xl"> <MdPersonOutline size={25}/> </label>
                                                <label>{autor.autor} </label>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 truncate text-center text-black/85"> {autor.nacionalidade} </td>
                                        <td className="px-5 py-4 truncate text-center text-black/85"> {autor.n_livros} </td>
                                        <td className="px-5 py-4 truncate text-center text-black/85">
                                            <div className="flex gap-2 items-center justify-center">
                                                <button className="cursor-pointer"> <LuFilePen size={30}/> </button>
                                                <button className="cursor-pointer"> <FiTrash2 size={30} className="text-red-700"/> </button>
                                            </div>
                                        </td>
                                                    
                                    </tr>
                                ))}
                            </tbody>
                    </table>
                    </div>
                </section>
            ) : tipo === "relatorios" ?(
                <div className="w-full bg-white rounded-2xl px-8 py-5">
                    <section className="py-5 flex flex-col">
                        <label className="text-xl">Dados Mensais Detalhados</label>
                        <label className="text-black/70">Resumo completo das actividades</label>
                    </section>
                    
                    <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                        <thead className="bg-black/5">
                            <tr>
                                <th className="w-[15%] py-3 px-5 text-center">Meses</th>
                                <th className="w-[15%] py-3 px-5 text-center">Empréstimos</th>
                                <th className="w-[10%] py-3 px-5 text-center">Devoluções</th>
                                <th className="w-[15%] py-3 px-5  text-center">Novos Estudantes</th>
                                <th className="w-[10%] py-3 px-5 text-center">Multas (kz)</th>
                                <th className="w-[15%] py-3 px-5 text-center">Livros Adicionados</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10">
                            {rowsTableEstrato.map(row => (
                                <tr className="hover:bg-black/3 transition">
                                    <td className="py-4 px-5 truncate text-center text-black/85"> {row.mes} </td>
                                    <td className="py-4 px-5 truncate text-center text-black/85"> {row.emprestimo} </td>
                                    <td className="py-4 px-5 truncate text-center text-black/85"> {row.devoluicao} </td>
                                    <td className="py-4 px-5 truncate text-center text-black/85"> {row.estudante} </td>
                                    <td className="py-4 px-5 truncate text-center text-black/85"> {row.multas} </td>
                                    <td className="py-4 px-5 truncate text-center text-black/85"> {row.livros} </td>
                                </tr>
                            ))} 
                        </tbody>
                    </table>
                </div>
            ) : tipo === "admins" ?(
                <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                    <section className="py-5 flex flex-col">
                        <label className="text-xl">Lista de Administradores</label>
                        <label className="text-black/70">Exibindo 8 de 8 livros</label>
                    </section>

                    <section>
                            <table className="w-full table-fixed border-collapse bg-white shadow rounded-xl overflow-hidden">
                                <thead className="bg-black/5">
                                    <tr className="flex gap-10 bg-black/3 transition">
                                        <th className="w-[15%] px-5 py-3 text-left">Administrador</th>
                                        <th className="w-[14%] px-5 py-3 text-left">NIF</th>
                                        <th className="w-[11%] px-5 py-3 text-left">Função</th>
                                        <th className="w-[13%] px-5 py-3 text-left">Último login</th>
                                        <th className="w-[15%] px-5 py-3 text-left">Estado</th>
                                        <th className="w-[5%] px-5 py-3 text-left">Acções</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/10">
                                    {admins.map(adm => (
                                        <tr className="w-full grid grid-cols-6  hover:bg-black/3 transition" key={adm.id}>
                                            <td className="px-5 py-4 truncate text-black/85">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-[#f97b17] text-white flex items-center justify-center font-bold shrink-0">
                                                        {obterIniciais(adm.nome)}
                                                    </div>

                                                    <div className="overflow-hidden">
                                                        <p className="font-medium truncate">
                                                            {adm.nome}
                                                        </p>
                                                        <p className="text-sm text-cinza-900 truncate">
                                                            nome@gmail.com
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* <td className="px-5 py-4 truncate text-black/85"> {adm.nome} </td> */}
                                            <td className="px-5 py-4 truncate text-black/85"> {adm.nif} </td>
                                            <td className="px-5 py-4 truncate text-black/85 "> <button className={`text-center py-1 px-3 rounded ${adm.funcao === 'Super Admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>{adm.funcao} </button></td>
                                            <td className="px-5 py-4 truncate text-black/85"> 09/01/2026 </td>
                                            <td className="px-5 py-4 truncate text-black/85"> {adm.estado} </td>
                                            <td className="px-5 py-4 truncate text-black/85"> 
                                                <button className="px-3 py-2 border border-black/10 bg-cinza-100">Editar</button>
                                            </td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                        </table>
                    </section>
                </section>
            ) : tipo === "multas" ?(
                <div className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                    
                    <article className="py-5 flex flex-col">
                        <h1 className="text-xl">Lista de Multas</h1>
                        <p className="text-black/70">Exibindo {totalM} multas</p>
                    </article>

                    <section>
                        <table className="w-full table-fixed border-collapse bg-white shadow rounded-xl overflow-hidden">
                            <thead className="bg-black/5">
                                <tr className="flex gap-10 bg-black/3 transition">
                                    <th className="w-[10%] px-5 py-3 text-left">Estudante</th>
                                    <th className="w-[9%] px-5 py-3 text-left">Motivo</th>
                                    <th className="w-[9%] px-5 py-3 text-left">Descrição</th>
                                    <th className="w-[9%] px-5 py-3 text-left">Valor</th>
                                    <th className="w-[10%] px-5 py-3 text-left">Data</th>
                                    <th className="w-[11%] px-5 py-3 text-center">Estado</th>
                                    <th className="w-[20%] px-5 py-3 text-center">Acções</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/10">
                                {multas.map(multa => (
                                    <tr className="w-full grid grid-cols-8  hover:bg-black/3 transition" key={multa.id}>
                                        <td className="px-5 py-4 truncate text-black/85"> {multa.estudante} </td>
                                        <td className="px-5 py-4 truncate text-black/85"> {multa.motivo} </td>
                                        <td className="px-5 py-4 truncate text-black/85"> {multa.descricao} </td>
                                        <td className="px-5 py-4 truncate text-black/85"> {multa.valor} </td>
                                        <td className="px-5 py-4 truncate text-black/85"> {multa.data} </td>
                                        <td className="px-5 py-4 truncate text-black/85 text-center"> 
                                            <button className={` ${multa.estado === "Pendente" 
                                                        ? "bg-yellow-100 text-yellow-700 px-4 py-1 rounded-2xl" : multa.estado === "Pago"
                                                        ? "bg-green-100 text-green-700 px-4 py-1 rounded-2xl" : multa.estado === "Dispensado"
                                                        ? "bg-blue-100 text-blue-700 px-4 py-1 rounded-2xl" : ""}`}>
                                                {multa.estado}
                                            </button>
                                        </td>
                                        <td className="px-5 py-4 flex text-black/85 text-center space-x-1"> 
                                            <button className="px-3 text-nowrap border border-black/10 bg-black/3 hover:bg-black/20 hover:text-white transition duration-200
                                             rounded-2xl cursor-pointer">
                                                Marcar Pago
                                            </button>
                                            <button className="px-3 py-1 text-blue-700 border border-black/10 bg-black/2 hover:bg-blue-100 rounded-2xl cursor-pointer">
                                                Dispensar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            ) : (
                null
            )}

            
            {showModalCategoria && <Modal tipo="categoria" onClose={() => setShowModalCategoria(false)}/> }
            {showModalAutor && <Modal tipo="autor" onClose={() => setShowModalAutor(false)}/> }
        </main>
    );
}
export default Table;