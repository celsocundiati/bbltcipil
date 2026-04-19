import { useEffect, useState } from "react";
import HeaderCardInfo from "./headcard";
import { FiPhone } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import api from "../../../service/api/api";
import { useAuth } from "../../../auth/userAuth/useauth";
import { podeGerir } from "../../../auth/podegerir/permissao";


function CardInfo() {

  const [formData, setFormData] = useState({
    limite_reservas_ativas: 0,
    limite_reservas_uso: 0,
    limite_reservas_mensal: 0,
    dias_emprestimo: 0,
    limite_livros_estudante: 0,
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

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  // 🔄 CARREGAR CONFIG
  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        const res = await api.get("/admin/configuracoes/");
        setFormData(res.data);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  // 🔄 ALTERAÇÃO DINÂMICA
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // 💾 GUARDAR
  async function handleSubmit(e) {
    if (!podeGerir(user)) return;
    e.preventDefault();

    try {
      setLoading(true);

      await api.put("/admin/configuracoes/1/", formData);

      alert("Configurações atualizadas com sucesso 🚀");

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
      {/* RESERVAS */}
      <section className="w-full border border-black/10 rounded-lg">
        <HeaderCardInfo tipo="reservas" />

        <article className="grid md:grid-cols-3 gap-6 p-5">

          <div>
            <h3>Reservas Ativas</h3>
            <input
              type="number"
              name="limite_reservas_ativas"
              value={formData.limite_reservas_ativas}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-[#f97b17]"
            />
          </div>

          <div>
            <h3>Reservas em Uso</h3>
            <input
              type="number"
              name="limite_reservas_uso"
              value={formData.limite_reservas_uso}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-[#f97b17]"
            />
          </div>

          <div>
            <h3>Reservas Mensais</h3>
            <input
              type="number"
              name="limite_reservas_mensal"
              value={formData.limite_reservas_mensal}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-[#f97b17]"
            />
          </div>

        </article>
      </section>

      {/* EMPRÉSTIMOS */}
      <section className="w-full border border-black/10 rounded-lg">
        <HeaderCardInfo tipo="emprestimos" />

        <article className="grid md:grid-cols-2 gap-6 p-5">

          <div>
            <h3>Dias Padrão</h3>
            <input
              type="number"
              name="dias_emprestimo"
              value={formData.dias_emprestimo}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]"
            />
          </div>

          <div>
            <h3>Limite de Livros</h3>
            <input
              type="number"
              name="limite_livros_estudante"
              value={formData.limite_livros_estudante}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]"
            />
          </div>

        </article>
      </section>

      {/* MULTAS */}
      <section className="w-full border border-black/10 rounded-lg">
        <HeaderCardInfo tipo="multas" />

        <article className="grid md:grid-cols-3 gap-6 p-5">
          
          <div>
            <h3>Multa por dia</h3>
            <input type="number" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" 
              name="multa_por_dia" value={formData.multa_por_dia} onChange={handleChange} />
          </div>

          
          <div>
            <h3>Multa por dano</h3>
            <input type="number" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" 
              name="multa_por_dano" value={formData.multa_por_dano} onChange={handleChange} />
          </div>
          
          <div>
            <h3>Multa por perda</h3>
            <input type="number" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" 
              name="multa_por_perda" value={formData.multa_por_perda} onChange={handleChange} />
          </div>

        </article>
      </section>

      {/* HORÁRIOS */}
      <section className="w-full border border-black/10 rounded-lg">
        <HeaderCardInfo tipo="horarios" />

        <article className="grid md:grid-cols-4 gap-6 p-5">

          <div>
            <h3>Dias de Semana abertura</h3>
            <input type="time" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" name="horario_semana_abertura" 
              value={formData.horario_semana_abertura} onChange={handleChange} />
          </div>
          
          <div>
            <h3>Dias de semana fechamento</h3>
            <input type="time" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" 
              name="horario_semana_fecho" 
              value={formData.horario_semana_fecho} onChange={handleChange} />
          </div>

          
          <div>
            <h3>Dias de Semana abertua</h3>
            <input type="time" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" 
              name="horario_fim_semana_abertura" 
              value={formData.horario_fim_semana_abertura} onChange={handleChange} />
          </div>
          
          <div>
            <h3>Fins de semana fechamento</h3>
            <input type="time" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" 
              name="horario_fim_semana_fecho" 
              value={formData.horario_fim_semana_fecho} onChange={handleChange} />
          </div>

        </article>
      </section>

      {/* CONTACTOS */}
      <section className="w-full border border-black/10 rounded-lg">
        <HeaderCardInfo tipo="dados" />

        <article className="grid md:grid-cols-2 gap-6 p-5">

          <div className="flex items-center gap-2">
            <AiOutlineMail />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]"
            />
          </div>

          <div className="flex items-center gap-2">
            <FiPhone />
            <input
              type="text"
              required
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]"
            />
          </div>

        </article>
      </section>

      {/* BOTÕES */}
      
      {((podeGerir(user)) && 
        <div className="w-full flex flex-col md:flex-row justify-end items-center gap-4 pb-10">
          <button type="button" 
            className="w-full md:w-auto border border-black/15 hover:bg-black/5 bg-white py-2 px-6 rounded-xl text-black cursor-pointer transition outline-none"
            >Cancelar</button>
          <button type="submit" disabled={loading} 
            className="w-full md:w-auto bg-[#F97B17] hover:bg-[#F86417] py-2 px-6 rounded-xl text-white cursor-pointer transition outline-none">
            {loading ? "Salvando..." : "Guardar Alterações"}
          </button>
        </div>
      )}

    </form>
  );
}

export default CardInfo;