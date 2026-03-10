import {admins} from "../../../../dados/db.json"
import {HiOutlineShieldCheck} from "react-icons/hi2"
import {FiActivity} from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../../service/api/api";

export const obterIniciais = (nome) => {
    if(!nome) return "";
    const partes = nome.trim().split(" ");
    return partes.slice(0, 2).map(parte => parte[0].toUpperCase()).join("");
};


export const useDataReserva = () => {
    const [dataReserva, setDataReserva] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await api.get("/admin/dashboard/estatisticas-mensais/"); // URL do Django
            setDataReserva(res.data.slice(0, 6)); // Pega só os 6 primeiros meses
        } catch (error) {
            console.error("Erro ao carregar dados de reservas:", error);
        }
        };

        fetchData();
    }, []);

    return dataReserva;
};


export const useDataAcervo = () => {
    const [dataAcervo, setDataAcervo] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/admin/dashboard/estatisticas-acervo/");
                setDataAcervo(res.data);
            } catch (error) {
                console.error("Erro ao carregar dados do acervo:", error);
            }
        };

        fetchData();
    }, []);

    return dataAcervo;
};


// export const useDataAcervo = () => {
//     const [dataAcervo, setDataAcervo] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await api.get("/admin/dashboard/estatisticas-acervo/");
//                 if (res.data && Array.isArray(res.data)) {
//                     // Mapear para garantir chaves corretas
//                     const mapped = res.data.map((item, idx) => ({
//                         id: item.id || idx + 1,
//                         categoria: item.categoria,
//                         total: item.total,
//                         cor: item.cor || "#2563eb",
//                     }));
//                     setDataAcervo(mapped);
//                     console.log(mapped)
//                 }
//             } catch (error) {
//                 console.error("Erro ao carregar dados do acervo:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     return dataAcervo;
// };


export const rowsTableEstrato = [
    {mes:"Janeiro", emprestimo:10, devoluicao:10, estudante:60, multas:7000, livros:20, cor: "#F86417" },
    {mes:"Fevereiro", emprestimo:60, devoluicao:52, estudante:310, multas:300000, livros: 60, cor: "#F86417"},
    {mes:"Março", emprestimo:120, devoluicao:21, estudante:800, multas:12500, livros: 100, cor: "#F86417"},
    {mes:"Abril", emprestimo:170, devoluicao:15, estudante:802, multas:21000, livros:150, cor: "#F86417" },
    {mes:"Maio", emprestimo:200, devoluicao:31, estudante:900, multas:47000, livros:210, cor: "#F86417" },
    {mes:"Junho", emprestimo:0, devoluicao:0, estudante:0, multas:0, livros:0, cor: "#F86417"},
    {mes:"Juhlo", emprestimo:0, devoluicao:0, estudante:0, multas:0, livros:0, cor: "#F86417"},
    {mes:"Agosto", emprestimo:0, devoluicao:0, estudante:0, multas:0, livros:0, cor: "#F86417"},
    {mes:"Setembro", emprestimo:0, devoluicao:0, estudante:0, multas:0, livros:0, cor: "#F86417" },
    {mes:"Outubro", emprestimo:0, devoluicao:0, estudante:0, multas:0, livros:0, cor: "#F86417"},
    {mes:"Novembro", emprestimo:0, devoluicao:0, estudante:0, multas:0, livros:0, cor: "#F86417"},
    {mes:"Dezembro", emprestimo:0, devoluicao:0, estudante:0, multas:0, livros:0, cor: "#F86417"}
];

const totalAdmins = admins.length;
const superAdmins = admins.filter(adm => adm.funcao === "Super Admin");
const totalAdminsSuper = superAdmins.length;

export const adminsRotulos = [
    {icone:<HiOutlineShieldCheck size={40} />, label:"Total de Adm", value:totalAdmins},
    {icone:<FiActivity size={40} />, label:"Ativos Hoje", value:1},
    {icone:<HiOutlineShieldCheck size={40} />, label:"Super Admin", value:totalAdminsSuper}
];


export const dataAcervo = [
    {id: 1, categoria: "Tecnologia", total: 240, cor: "#2563eb"},
    {id: 2, categoria: "Ciência", total: 160, cor: "#16a34a"},
    {id: 3, categoria: "Cultura", total: 150, cor: "#9333ea"},
    {id: 4, categoria: "Cultura e Romance", total: 190, cor: "#f97316"},
    {id: 5, categoria: "Cultura e História", total: 140, cor: "#dc2626"},
    {id: 6, categoria: "Arte", total: 90, cor: "#003366"}
]