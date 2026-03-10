import {HiOutlineSquares2X2, HiOutlineBookOpen, HiOutlineUsers, 
    HiOutlineArrowPath, HiOutlineCalendarDays, 
    HiOutlineFolder, HiOutlineChartBar, HiOutlineCog6Tooth, 
    HiOutlineShieldCheck, HiOutlineArrowRightEndOnRectangle, HiOutlineExclamationTriangle, HiOutlineCurrencyDollar} from "react-icons/hi2";

import {livros, emprestimos, alunos} from "../../../dados/db.json";

    export const camposMain = [
        {icone:<HiOutlineSquares2X2 size={25} />, caminho:"dashboard", label:"Dashboard"},
        {icone:<HiOutlineBookOpen size={25} />, caminho:"gestao", label:"Gestão de livros"},
        {icone:<HiOutlineUsers size={25} />, caminho:"estudantes", label:"Estudantes"},
        {icone:<HiOutlineUsers size={25} />, caminho:"alunosoficiais", label:"Alunos Oficiais"},
        {icone:<HiOutlineCalendarDays size={25} />, caminho:"acervo", label:"Reservas"},
        {icone:<HiOutlineArrowPath size={25} />, caminho:"emprestimos", label:"Empréstimos"},
        {icone:<HiOutlineCurrencyDollar size={25}/>, caminho:"multas", label:"Multas"},
        {icone:<HiOutlineFolder size={25} />, caminho:"categoriasautores", label:"Categorias & Autores"},
        {icone:<HiOutlineChartBar size={25} />, caminho:"relatorios", label:"Relatórios"}
    ];

    export const camposBotton = [
        {icone:<HiOutlineCog6Tooth size={25} />, caminho:"configuracoesadmin", label:"Configurações"},
        {icone:<HiOutlineShieldCheck size={25} />, caminho:"admins", label:"Administradores"},
        {icone:<HiOutlineArrowRightEndOnRectangle size={25} />, caminho:"/", label:"Sair"}
    ];

    
    // const totalLivros = livros.length;
    const totalEmprestimos = emprestimos.length;

    export const gerarDashboardRotulos = (stats) => [
        { icone: <HiOutlineBookOpen size={25} />, titulo: "Total de Livros", label: stats.total_livros, descricao: `${stats.crescimento_livros}% vs mês anterior`, crescimento: stats.crescimento_livros },
        { icone: <HiOutlineCalendarDays size={25} />, titulo: "Empréstimos Ativos", label: stats.emprestimos_ativos, descricao: `${stats.crescimento_emprestimos}% vs mês anterior`, crescimento: stats.crescimento_emprestimos },
        { icone: <HiOutlineExclamationTriangle size={25} />, titulo: "Livros Atrasados", label: stats.livros_atrasados, descricao: `${stats.crescimento_atrasos}% vs mês anterior`, crescimento: stats.crescimento_atrasos },
        { icone: <HiOutlineUsers size={25} />, titulo: "Total de Perfis", label: stats.total_perfis, descricao: `${stats.crescimento_perfis}% vs mês anterior`, crescimento: stats.crescimento_perfis },
    ];

    // export const gerarDashboardRotulos = (stats) => [

    //     {
    //         icone: <HiOutlineBookOpen size={25} />,
    //         titulo: "Total de Livros",
    //         label: stats.total_livros,
    //         descricao: `${stats.crescimento_livros}% vs mês anterior`
    //     },

    //     {
    //         icone: <HiOutlineCalendarDays size={25} />,
    //         titulo: "Empréstimos Ativos",
    //         label: stats.emprestimos_ativos,
    //         descricao: `${stats.crescimento_emprestimos}% vs mês anterior`
    //     },

    //     {
    //         icone: <HiOutlineExclamationTriangle size={25} />,
    //         titulo: "Livros Atrasados",
    //         label: stats.livros_atrasados,
    //         descricao: `${stats.crescimento_atrasos}% vs mês anterior`
    //     },

    //     {
    //         icone: <HiOutlineUsers size={25} />,
    //         titulo: "Total de Estudantes",
    //         label: stats.total_estudantes,
    //         descricao: `${stats.crescimento_estudantes}% vs mês anterior`
    //     }

    // ];

    export const relatoriosRotulos = [
        {icone:<HiOutlineBookOpen size={30} />, titulo:"Empréstimos", label:totalEmprestimos, descricao:"+-16.6%"},
        {icone:<HiOutlineUsers size={30} />, titulo:"Novos Estudante", label:14, descricao:"+-49.3%"},
        {icone:<HiOutlineCurrencyDollar size={30} />, titulo:"Multas Cobradas", label:25000, descricao:"+-42.9%"},
        {icone:<HiOutlineBookOpen size={30} />, titulo:"Livros Adicionados", label:11, descricao:"+-37.8%"}
    ]

    
    const multasP = 20_000;
    const multasA = 300


    export const multasRotulos = [
        {icone:<HiOutlineCurrencyDollar size={30} />, titulo:"Total Pendente", label:multasP + " kz"},
        {icone:<HiOutlineCurrencyDollar size={30} />, titulo:"Total Pago", label:multasA + " kz"},
        {icone: "", titulo:"Nº Multas Pendentes", label:2},
        {icone: "", titulo:"Nº Multas Pagas", label:1}
    ]

