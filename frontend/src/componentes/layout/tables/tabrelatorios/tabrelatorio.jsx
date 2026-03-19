import { useEstatisticasMensais } from "../utilitarios/Utils";

function TabRelatorios(){

    const rowsTableEstrato = useEstatisticasMensais()

    return(
        <div className="w-full bg-white rounded-2xl px-8 py-5">
            <section className="py-5 flex flex-col">
                <label className="text-xl">Dados Mensais Detalhados</label>
                <label className="text-black/70">Resumo completo das actividades</label>
            </section>
            
            <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                <thead className="bg-black/5">
                    <tr>
                        <th className="w-[15%] py-3 px-5 text-center">Meses</th>
                        <th className="w-[15%] py-3 px-5 text-center">Reservas</th>
                        <th className="w-[15%] py-3 px-5 text-center">Empréstimos</th>
                        <th className="w-[10%] py-3 px-5 text-center">Devoluções</th>
                        <th className="w-[15%] py-3 px-5  text-center">Novos Perfis</th>
                        <th className="w-[10%] py-3 px-5 text-center">Multas (kz)</th>
                        <th className="w-[15%] py-3 px-5 text-center">Total de Livros Usados</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                    {rowsTableEstrato.map(row => (
                        <tr className="hover:bg-black/3 transition">
                            <td className="py-4 px-5 truncate text-center text-black/85"> {row.mes} </td>
                            <td className="py-4 px-5 truncate text-center text-black/85"> {row.reservas} </td>
                            <td className="py-4 px-5 truncate text-center text-black/85"> {row.emprestimos} </td>
                            <td className="py-4 px-5 truncate text-center text-black/85"> {row.devolucoes} </td>
                            <td className="py-4 px-5 truncate text-center text-black/85"> {row.perfil} </td>
                            <td className="py-4 px-5 truncate text-center text-black/85"> {row.multas} </td>
                            <td className="py-4 px-5 truncate text-center text-black/85"> {row.livros} </td>
                        </tr>
                    ))} 
                </tbody>
            </table>
        </div>
    )
}

export default TabRelatorios;