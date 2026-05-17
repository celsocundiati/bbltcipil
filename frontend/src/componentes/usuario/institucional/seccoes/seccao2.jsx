import { HiOutlineInformationCircle, HiOutlineBookOpen, HiOutlineClipboardDocumentCheck, 
        HiOutlineClipboardDocumentList, HiOutlineShieldCheck } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../../service/api/api";



function Seccao2() {

    const [loading, setLoading] = useState(false);

    // const [formData, setFormData] = useState()
        
    const [formData, setFormData] = useState({
        limite_reservas_ativas: 0,
        limite_reservas_uso: 0,
        limite_reservas_mensal: 0,
        dias_emprestimo: 0,
        limite_livros_estudante: 0,
        cobranca_ativa: true,
        multa_por_dia: 0,
        multa_por_dano: 0,
        multa_por_perda: 0,
        horario_semana_abertura: "08:00",
        horario_semana_fecho: "16:00",
        horario_fim_semana_abertura: "08:00",
        horario_fim_semana_fecho: "12:00",
        email: "",
        telefone: ""
    });


    // 🔄 CARREGAR CONFIG
    useEffect(() => {
        async function fetchConfig() {
        try {
            setLoading(true);
            const res = await api.get("/livros/configuracoes/");
            setFormData(res.data);

            console.log(formData)
        } catch (error) {
            
            console.error("Erro ao carregar configurações:", error);
        } finally {

            setLoading(false);
            
        }
        }

        fetchConfig();
    }, []);

    
    return (
        <section className="bg-[#f9fafc] p-4 sm:p-6 md:p-8 shadow-sm mb-6 rounded-2xl">
            
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 text-center sm:text-left">
                <HiOutlineInformationCircle size={28} className="text-[#F86417]" />
                <h2 className="text-xl sm:text-2xl ">
                    Informação da Biblioteca
                </h2>
            </div>

            {/* GRID RESPONSIVO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">

                {/* CARD 1 */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <div className="flex items-center gap-3 mb-2">
                        <HiOutlineBookOpen size={26} className="text-[#F86417]" />
                        <h3 className="text-lg sm:text-xl text-gray-800">
                            Empréstimos de livros
                        </h3>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base mt-2">
                        Os professores podem emprestar livros apartir de reservas por um período determinado de {formData.dias_emprestimo} dias.
                        Utilize o sistema para verificar a disponibilidade e realizar empréstimos.
                    </p>
                </div>

                {/* CARD 2 */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <div className="flex items-center gap-3 mb-2">
                        <HiOutlineClipboardDocumentCheck size={26} className="text-[#F86417]" />
                        <h3 className="text-lg sm:text-xl text-gray-800">
                            Reservar livros
                        </h3>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base mt-2">
                        Reserve livros facilmente pelo sistema para uso na biblioteca ou empréstimo sem processos desnecessários.
                    </p>
                </div>

                {/* CARD 3 */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <div className="flex items-center gap-3 mb-2">
                        <HiOutlineClipboardDocumentList size={26} className="text-[#F86417]" />
                        <h3 className="text-lg sm:text-xl text-gray-800">
                            Regras de Uso
                        </h3>
                    </div>

                    <div className="space-y-2 mt-3">

                        <div className="flex items-start gap-2">
                            <FiArrowRight size={18} className="text-[#F86417] mt-1" />
                            <span className="text-gray-600 text-sm sm:text-base">
                                Respeitar os prazos de entrega dos livros e manter o silêncio é fundamental.
                            </span>
                        </div>

                        <div className="flex items-start gap-2">
                            <FiArrowRight size={18} className="text-[#F86417] mt-1" />
                            <span className="text-gray-600 text-sm sm:text-base">
                                Máximo de {formData.limite_reservas_uso} livros por usuário.
                            </span>
                        </div>
                        <div className="flex items-start gap-2">
                            <FiArrowRight size={18} className="text-[#F86417] mt-1" />
                            <span className="text-gray-600 text-sm sm:text-base">
                                Limite de {formData.limite_reservas_mensal} livros por mês para cada usuário.
                            </span>
                        </div>
                        <div className="flex items-start gap-2">
                            <FiArrowRight size={18} className="text-[#F86417] mt-1" />
                            <span className="text-gray-600 text-sm sm:text-base">
                                Limite total de {formData.limite_reservas_ativas} reservas por cada usuário.
                            </span>
                        </div>

                        <div className="flex items-start gap-2">
                            <FiArrowRight size={18} className="text-[#F86417] mt-1" />
                            <span className="text-gray-600 text-sm sm:text-base">
                                Usuários com multas não podem reservar.
                            </span>
                        </div>

                        <div className="flex items-start gap-2">
                            <FiArrowRight size={18} className="text-[#F86417] mt-1" />
                            <span className="text-gray-600 text-sm sm:text-base">
                                Descumprimento pode levar a bloqueio ou banimento.
                            </span>
                        </div>

                    </div>
                </div>

                {/* CARD 4 */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <div className="flex items-center gap-3 mb-2">
                        <HiOutlineShieldCheck size={26} className="text-[#F86417]" />
                        <h3 className="text-lg sm:text-xl text-gray-800">
                            Política de Privacidade
                        </h3>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base mt-2">
                        O sistema protege os dados dos usuários e utiliza as informações apenas para melhorar a experiência.
                    </p>
                </div>

            </div>
        </section>
    );
}

export default Seccao2;