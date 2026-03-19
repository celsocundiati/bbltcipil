import { admins, multas } from "../../../dados/db.json";
import { obterIniciais } from "./utilitarios/Utils";



function Table({tipo}){

    const totalM = multas.length;

    return(
        <main>
            {tipo === "admins" ?(
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
        </main>
    );
}
export default Table;