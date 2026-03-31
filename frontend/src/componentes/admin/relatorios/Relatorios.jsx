import RotulosOutle from "../../layout/outle/rotulosotles";
import Grafic from "../../layout/grafics/Grafic";
import { useEstatisticasMensais } from "../../layout/tables/utilitarios/Utils";
import TituloGrafico from "./seccoes/titulografico";
import { motion } from "framer-motion";
import TabRelatorios from "../../layout/tables/tabrelatorios/tabrelatorio";
import {HiOutlineArrowDownTray} from "react-icons/hi2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";
import { useAuth } from "../../auth/userAuth/useauth";
import { podeGerir } from "../../auth/podegerir/permissao";


function Relatorios(){

  const rowsTableEstrato = useEstatisticasMensais();
  
  const { user } = useAuth();

  const [loadingPDF, setLoadingPDF] = useState(false);

  // 📄 EXPORTAR PDF
  const exportPDF = () => {
    if (!rowsTableEstrato || rowsTableEstrato.length === 0) {
      alert("Sem dados para exportar neste período.");
      return;
    }

    setLoadingPDF(true);

    const doc = new jsPDF();
    const dataAtual = new Date().toLocaleString();

    // 🔹 Cabeçalho
    doc.setFontSize(16);
    doc.text("BIBLIOTECA IPIL", 14, 15);
    doc.setFontSize(10);
    doc.text("Relatório Mensal Detalhado", 14, 22);
    doc.setFontSize(9);
    doc.text(`Gerado em: ${dataAtual}`, 14, 28);

    // 🔹 Tabela
    const tableColumn = [
      "Mês",
      "Reservas",
      "Empréstimos",
      "Devoluções",
      "Novos Perfis",
      "Multas (kz)",
      "Total de Livros/Mês"
    ];

    const tableRows = rowsTableEstrato.map((row) => [
      row.mes,
      row.reservas,
      row.emprestimos,
      row.devolucoes,
      row.perfil,
      row.multas,
      row.livros
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [248, 100, 23] }, // cor laranja
      columnStyles: { 0: { cellWidth: 25 } },
      margin: { left: 14, right: 14 }
    });

    // 🔹 Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(`RelatorioMensal_${new Date().toISOString().slice(0, 10)}.pdf`);
    setLoadingPDF(false);
  };

    return(
        <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo
            className=" mt-12 space-y-20">
            <section>
                <section className="flex relative flex-wrap justify-between items-center mt-30">
                    <section className="space-y-2">
                        <h1 className="text-2xl font-medium">Relatórios</h1>
                        <p className="text-black/70 text-lg">Analisa detalhadamente as actividades da biblioteca</p>
                    </section>

                    <button onClick={exportPDF} className="flex items-center bg-[#F86417] text-white px-4 h-10 text-lg rounded-lg gap-2 cursor-pointer">
                        <HiOutlineArrowDownTray size={25}/> Exportar Relatórios
                    </button>
                    
                </section>
            </section>
            <section>
                <RotulosOutle page="relatorios"/>
            </section>
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <article className="bg-white border border-black/10 rounded-lg p-8 space-y-12">
                    <TituloGrafico variant="line"/>
                    <Grafic variant="line" data={rowsTableEstrato} xkey="mes" lines={[
                        {dataKey: "emprestimos"},{dataKey: "devoluicoes", color:"#16a34a", with: 1},]} 
                    />
                </article>
                <article className="bg-white border border-black/10 rounded-lg p-8 space-y-12">
                    <TituloGrafico variant="bar"/>
                    <Grafic variant="bar" data={rowsTableEstrato} xkey="mes" barkey="multas" />
                </article>
            </section>
            <section className="w-full grid grid-cols-1 border border-black/10 rounded-lg">
                <TabRelatorios/>
            </section>
        </motion.main>
    );
}
export default Relatorios;