import {alunos, emprestimos} from "../../../dados/db.json";
import { dashboardRotulos, relatoriosRotulos, multasRotulos } from "../../layout/campos/campos";
import { HiOutlineTrendingUp } from "react-icons/hi";
import { adminsRotulos } from "../../layout/tables/utilitarios/Utils";

function RotulosOutle({page})
{
    const alunosAtivos = alunos.filter(aluno => aluno.estado === "Ativo");
    const alunosSuspensos = alunos.filter(aluno => aluno.estado === "Suspenso");
    const alunosEmprestimos = alunos.filter(aluno => aluno.emprestimos !== 0);

    const emprestimosAtivos = emprestimos.filter(emprest => emprest.estado === "Ativo");
    const emprestimosAtrasados = emprestimos.filter(emprest => emprest.estado === "Atrasado");

    return(
        <main>
            {page === "dashboard" ?(
                <section className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
                    {dashboardRotulos.map((admR, index) => (
                        <div key={index} className="bg-white w-full px-4 py-5 border border-black/10 rounded-lg flex justify-between hover:shadow transition">
                            <div>
                                <p className="text-black/70"> {admR.titulo} </p>
                                <label className="text-lg"> {admR.label} </label>
                                <span className="flex items-center gap-2 text-green-600"> 
                                    <HiOutlineTrendingUp size={20}/> <p>{admR.descricao}</p> 
                                </span>
                            </div>
                            <div className="flex items-center justify-center bg-black/5 h-8 text-[#F97B17] px-2 rounded-md"> {admR.icone} </div> 
                        </div>
                    ))}
                </section>

            ) : page === "estudantes" ?(

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <div className="bg-white p-6 rounded-xl border border-black/10 hover:shadow transition">
                        <p className="text-black/60 text-sm">Total de Estudantes</p>
                        <p className="text-3xl font-bold text-[#F97B17]">
                            {alunos.length}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-black/10 hover:shadow transition">
                        <p className="text-black/60 text-sm">Ativos</p>
                        <p className="text-3xl font-bold text-green-600">
                            {alunosAtivos.length}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-black/10 hover:shadow transition">
                        <p className="text-black/60 text-sm">Com Empréstimos</p>
                        <p className="text-3xl font-bold text-blue-600">
                            {alunosEmprestimos.length}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-black/10 hover:shadow transition">
                        <p className="text-black/60 text-sm">Com Atrasos</p>
                        <p className="text-3xl font-bold text-red-600">
                            {alunosSuspensos.length}
                        </p>
                    </div>

                </section>


            ) : page === "emprestimos" ?(

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <div className="bg-white p-6 rounded-xl border border-black/10 hover:shadow transition">
                        <p className="text-black/60 text-sm">Total Ativos</p>
                        <p className="text-3xl font-bold text-[#F97B17]">
                            {emprestimosAtivos.length}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-black/10 hover:shadow transition">
                        <p className="text-black/60 text-sm">Atrasados</p>
                        <p className="text-3xl font-bold text-red-600">
                            {emprestimosAtrasados.length}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-black/10 hover:shadow transition">
                        <p className="text-black/60 text-sm">Devoluções Hoje</p>
                        <p className="text-3xl font-bold text-green-600">
                            0
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-black/10 hover:shadow transition">
                        <p className="text-black/60 text-sm">Vencimento Próximo</p>
                        <p className="text-3xl font-bold text-blue-600">
                            0
                        </p>
                    </div>

                </section>

            ) : page === "relatorios" ?(
                <section className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
                    {relatoriosRotulos.map((admR, index) => (
                        <div key={index} className="bg-white w-full p-4 border border-black/10 rounded-lg flex justify-between hover:shadow transition">
                            <div className="space-y-2">
                                <div className="bg-black/5 w-15 p-3 text-[#F97B17] flex justify-center items-center rounded-md">
                                    {admR.icone}
                                </div>
                                <div>
                                    <p className="text-black/70"> {admR.titulo} </p>
                                    <label className="text-lg"> {admR.label} </label>
                                </div>
                            </div>
                            <span className="flex  gap-2 text-green-600"> 
                                <HiOutlineTrendingUp size={20}/> <p>{admR.descricao}</p> 
                            </span>
                        </div>
                    ))}
                </section>
            ) : page === "admins" ?(
                <section className="w-full grid grid-cols-3 gap-5">
                    {adminsRotulos.map((admR, index) => (
                        <div key={index} className="w-full border border-black/10 rounded-lg p-5 flex gap-4 bg-white hover:shadow transition">
                            <div className="h-13 flex items-center px-2 py-1 text-[#F97B17] bg-black/3 rounded-md"> {admR.icone} </div>
                            <div>
                                <p className="text-lg text-black/57"> {admR.label} </p>
                                <label className="text-lg"> {admR.value} </label>
                            </div>
                        </div>
                    ))}
                </section>
            ) : page === "multas" ?(
                <section className="w-full grid grid-cols-4 gap-5">
                    {multasRotulos.map((admR, index) => (
                        <div key={index} className="w-full border border-black/10 rounded-lg p-5 flex justify-between bg-white hover:shadow transition">
                            <div>
                                <p className="text-lg text-black/57"> {admR.titulo} </p>
                                <label className="text-lg"> {admR.label} </label>
                            </div>
                            <div className="h-13 flex items-center px-2 py-1 text-[#F97B17] bg-black/3 rounded-md"> {admR.icone} </div> 
                        </div>
                    ))}
                </section>

            ) : (
                null
            )}
        </main>
    );
}
export default RotulosOutle;