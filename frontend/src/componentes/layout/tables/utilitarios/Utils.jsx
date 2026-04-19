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

export const useEstatisticasMensais = () => {
    const [dataReserva, setDataReserva] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await api.get("/admin/dashboard/estatisticas-mensais/"); // URL do Django
            setDataReserva(res.data); // Pega só os 6 primeiros meses
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

export const useDataStates = () => {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await api.get("admin/dashboard/stats/");
            setDashboardData(res.data);
        };

        fetchData();
    }, []); // ✅ roda só uma vez

    return dashboardData;
};

export const useResumoGeral = () => {
    const [resumo, setResumo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/admin/dashboard/resumo-geral/");
                setResumo(Array.isArray(res.data.results) ? res.data.results : res.data);
            } catch (err) {
                console.error("Erro ao carregar dashboard:", err);
            }
        };

        fetchData();
    }, []);

    return resumo;
};
