import api from "../../../service/api/api";
import { useEffect, useState } from "react";

function Participacoes()
{
    const [participacoes, setParticipacoes] = useState([]);
    const [loading, setLoading] = useState(false);

    const carregar = async () => {
        try {
            const res = await api.get("/livros/participacoes/");
            setParticipacoes(res.data);
        } catch (error) {
            alert("Erro na captura de participações", error)
        }
        setLoading(false);
    }

    useEffect(() => {
        carregar();
    }, []);

    if(loading) return <p>Carregando...</p>

    return(
        <div>
            <h2>Minhas Participações</h2>
            {participacoes.map((p) => (
                <div key={p.id}>
                    <p> <strong>Exposição:</strong> {p.exposicao ? p.exposicao?.titulo : p.evento?.titulo} </p>
                    <p> <strong>Compareceu:</strong> {p.compareceu ? "Sim" : "Não"} </p>
                    <p> <strong>Data:</strong> {p.data_registro} </p>
                </div>
            ))}
        </div>
    );
}

export default Participacoes;