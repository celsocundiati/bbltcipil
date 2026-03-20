// import HeaderCardInfo from "./headcard";
// import { FiPhone } from "react-icons/fi";
// import { AiOutlineMail } from "react-icons/ai";

// function CardInfo() {
//   return (
//     <main className="w-full flex flex-col gap-8 overflow-x-hidden">

//       {/* EMPRÉSTIMOS */}
//       <section className="w-full border border-black/10 rounded-lg min-h-[250px]">
//         <HeaderCardInfo tipo="emprestimos" />
//         <article className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
//           <div>
//             <h3 className="font-semibold text-lg">
//               Dias Padrão de Empréstimos
//             </h3>
//             <input
//               type="number"
//               required
//               value={14}
//               className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"
//             />
//             <p className="text-black/70 text-lg">
//               Número de dias para a devolução
//             </p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg">
//               Limites de Livros por Estudante
//             </h3>
//             <input
//               type="number"
//               required
//               value={3}
//               className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"
//             />
//             <p className="text-black/70 text-lg">
//               Máximo de livros simultâneos
//             </p>
//           </div>
//         </article>
//       </section>

//       {/* MULTAS */}
//       <section className="w-full border border-black/10 rounded-lg min-h-[250px]">
//         <HeaderCardInfo tipo="multas" />
//         <article className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
//           <div>
//             <h3 className="font-semibold text-lg">
//               Multas por Dias (kz)
//             </h3>
//             <input
//               type="number"
//               required
//               value={500}
//               className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"
//             />
//             <p className="text-black/70 text-lg">
//               Por dia de atraso
//             </p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg">
//               Multas por Danos (kz)
//             </h3>
//             <input
//               type="number"
//               required
//               value={1500}
//               className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"
//             />
//             <p className="text-black/70 text-lg">
//               Por livro danificado
//             </p>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg">
//               Por livro perdido (kz)
//             </h3>
//             <input
//               type="number"
//               required
//               value={5000}
//               className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"
//             />
//             <p className="text-black/70 text-lg">
//               Valor por perda definitiva
//             </p>
//           </div>
//         </article>
//       </section>

//       {/* HORÁRIOS */}
//       <section className="w-full border border-black/10 rounded-lg min-h-[250px]">
//         <HeaderCardInfo tipo="horarios" />
//         <article className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
//           <div>
//             <h3 className="font-semibold text-lg">
//               Dias de Semana
//             </h3>
//             <div className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center">
//               08:00h - 16:00h
//             </div>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg">
//               Fins de Semana
//             </h3>
//             <div className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center">
//               08:00h - 12:00h
//             </div>
//           </div>
//         </article>
//       </section>

//       {/* DADOS */}
//       <section className="w-full border border-black/10 rounded-lg min-h-[250px]">
//         <HeaderCardInfo tipo="dados" />
//         <article className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
//           <div>
//             <h3 className="font-semibold text-lg">
//               Email
//             </h3>
//             <div className="w-full flex items-center gap-2 h-10 px-5 py-2 my-2 bg-black/3 border border-black/5 rounded-2xl">
//               <AiOutlineMail size={20} />
//               <input
//                 type="email"
//                 required
//                 value="bibliotecaipil@gmail.com"
//                 className="w-full outline-none bg-transparent"
//               />
//             </div>
//           </div>

//           <div>
//             <h3 className="font-semibold text-lg">
//               Telefone
//             </h3>
//             <div className="w-full flex items-center gap-2 h-10 px-5 py-2 my-2 bg-black/3 border border-black/5 rounded-2xl">
//               <FiPhone size={20} />
//               <input
//                 type="number"
//                 required
//                 value={244974107262}
//                 className="w-full outline-none bg-transparent"
//               />
//             </div>
//           </div>
//         </article>
//       </section>

//       {/* BOTÕES */}
//       <article className="w-full flex flex-col md:flex-row justify-end items-center gap-4 pb-10">
//         <button
//           type="button"
//           className="w-full md:w-auto border border-black/15 hover:bg-black/5 bg-white py-2 px-6 rounded-xl text-black cursor-pointer transition"
//         >
//           Cancelar Alterações
//         </button>

//         <button
//           type="submit"
//           className="w-full md:w-auto bg-[#F97B17] hover:bg-[#F86417] py-2 px-6 rounded-xl text-white cursor-pointer transition"
//         >
//           Guardar Alterações
//         </button>
//       </article>

//     </main>
//   );
// }

// export default CardInfo;


import { useEffect, useState } from "react";
import HeaderCardInfo from "./headcard";
import { FiPhone } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import api from "../../../service/api/api";

function CardInfo() {

  const [formData, setFormData] = useState({
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
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]"
            />
          </div>

        </article>
      </section>

      {/* BOTÕES */}
      <div className="w-full flex flex-col md:flex-row justify-end items-center gap-4 pb-10">
        <button type="button" 
          className="w-full md:w-auto border border-black/15 hover:bg-black/5 bg-white py-2 px-6 rounded-xl text-black cursor-pointer transition outline-none"
          >Cancelar</button>
        <button type="submit" disabled={loading} 
          className="w-full md:w-auto bg-[#F97B17] hover:bg-[#F86417] py-2 px-6 rounded-xl text-white cursor-pointer transition outline-none">
          {loading ? "Salvando..." : "Guardar Alterações"}
        </button>
      </div>

    </form>
  );
}

export default CardInfo;