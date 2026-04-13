import { HiOutlineTrendingUp } from "react-icons/hi";
import { gerarDashboardRotulos } from "../../layout/campos/campos";
import { useDataStates, useResumoGeral } from "../../layout/tables/utilitarios/Utils";
import Loading from "../motion/motion";

function RotulosOutle({ page }) {
    const resumo = useResumoGeral();
    const dashboardData = useDataStates();

    const dashboardRotulos = dashboardData
        ? gerarDashboardRotulos(dashboardData)
        : [];


    if (!resumo || !dashboardData) {
        return (
            <div className="w-full flex items-center justify-center">
                <p className="text-xl animate-pulse">Carregando cards...</p>
            </div>
        );
    }

    return (
        <main>
            {page === "dashboard" && (
                <section className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-7">
                    {dashboardRotulos.map((card, idx) => (
                        <div key={idx} className="bg-white w-full px-4 py-5 border border-black/10 rounded-lg flex justify-between hover:shadow transition">
                            <div>
                                <p className="text-black/70">{card.titulo}</p>
                                <label className="text-lg">{card.label}</label>
                                <span className="flex items-center gap-2 text-green-600">
                                    <HiOutlineTrendingUp size={20}/> {card.descricao}
                                </span>
                            </div>
                            <div className="flex items-center justify-center bg-black/5 h-8 text-[#F97B17] px-2 rounded-md">
                                {card.icone}
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {page === "perfil" && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card titulo="Total de Perfis" valor={resumo.perfis.total} cor="#F97B17" />
                    <Card titulo="Ativos" valor={resumo.perfis.ativos} cor="#22C55E" />
                    <Card titulo="Com Empréstimos" valor={resumo.perfis.com_emprestimos} cor="#3B82F6" />
                    <Card titulo="Suspensos" valor={resumo.perfis.suspensos} cor="#EF4444" />
                </section>
            )}

            {page === "emprestimos" && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card titulo="Ativos" valor={resumo.emprestimos.ativos} cor="#F97B17" />
                    <Card titulo="Atrasados" valor={resumo.emprestimos.atrasados} cor="#EF4444" />
                    <Card titulo="Devoluções Hoje" valor={resumo.emprestimos.devolucoes_hoje} cor="#22C55E" />
                    <Card titulo="Vencimento Próximo" valor={resumo.emprestimos.vencimento_proximo} cor="#3B82F6" />
                </section>
            )}

            {page === "reservas" && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card titulo="Pendentes" valor={resumo.reservas.pendentes} cor="#FACC15" />
                    <Card titulo="Reservados" valor={resumo.reservas.reservadas} cor="#F97B17" />
                    <Card titulo="Em uso" valor={resumo.reservas.aprovadas} cor="#22C55E" />
                    <Card titulo="Finalizadas" valor={resumo.reservas.finalizadas} cor="#3B82F6" />
                </section>
            )}

            {page === "multas" && (
                <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <Card titulo="Total" valor={resumo.multas.total} cor="#F97B17" />
                    <Card titulo="Pendentes" valor={resumo.multas.pendentes} cor="#EF4444" />
                    <Card titulo="Pagas" valor={resumo.multas.pagas} cor="#22C55E" />
                    <Card titulo="Valor Total" valor={`$${resumo.multas.valor_total}`} cor="#3B82F6" />
                </section>
            )}

            {page === "admins" && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card titulo="Total de Admins" valor={resumo.admins.total} cor="#F97B17" />
                    <Card titulo="Admins Ativos" valor={resumo.admins.ativos} cor="#22C55E" />
                    <Card titulo="Ativos Hoje" valor={resumo.admins.ativos_hoje} cor="#22C55E" />
                    <Card titulo="Super Users" valor={resumo.admins.superusers} cor="#22C55E" />
                </section>
            )}

            {page === "relatorios" && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card titulo="Empréstimos este mês" valor={resumo.relatorios.emprestimos_mes} cor="#F97B17" />
                    <Card titulo="Novos perfis" valor={resumo.relatorios.novos_perfis} cor="#22C55E" />
                    <Card titulo="Livros Adicionados" valor={resumo.relatorios.livros_adicionados} cor="#22C55E" />
                </section>
            )}
        </main>
    );
}

const Card = ({ titulo, valor, cor }) => (
    <div className="bg-white p-6 rounded-xl border border-black/10 hover:shadow transition">
        <p className="text-black/60 text-sm">{titulo}</p>
        <p className="text-3xl font-bold" style={{ color: cor }}>{valor}</p>
    </div>
);

export default RotulosOutle;