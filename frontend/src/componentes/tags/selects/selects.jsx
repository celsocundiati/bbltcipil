// import axios from "axios";

// function Select({tipo, value, onChange, lbl}){

//     return(
//         <section>
//         {tipo === "categoria" ? (

            
//             <section className="flex flex-col">
//                 <section>
//                     <section className="flex flex-col">
//                         <label className="mb-3 ">{lbl ? "Categória" : ''}</label>
//                         <select value={value} onChange={onChange} className="border border-[#000000]/17 w-full lg:w-72 px-2 cursor-pointer outline-none h-10 rounded-lg">
//                             <option value="">Todas as categórias</option>
//                             <option value="Tecnologia">Tecnologia</option>
//                             <option value="Ciência">Ciência</option>
//                             <option value="Arte">Arte</option>
//                             <option value="Cultura">Cultura</option>
//                             <option value="Cultura e História">Cultura e História</option>
//                             <option value="Cultura e Romance">Cultura e Romance</option>
//                         </select>
//                     </section>
//                 </section>
//             </section>

//         ) : tipo === "estado" ?(
//             <section className="flex flex-col">
//                 <label className="mb-3 ">{lbl ? "Estado" : ''}</label>
//                 <select value={value} onChange={onChange} className="border border-[#000000]/17 w-full lg:w-72 px-2 cursor-pointer outline-none h-10 rounded-lg">
//                     <option value="">Todos os Status</option>
//                     <option value="Disponível">Disponível</option>
//                     <option value="Emprestado">Emprestado</option>
//                     <option value="Reservado">Reservado</option>
//                     <option value="Pendente">Pendente</option>
//                 </select>
//             </section>
//         ) : tipo === "todos" ?(
//             <section className="flex flex-col">
//                 <label className="mb-3 ">{lbl ? "Estado" : ''}</label>
//                 <select value={value} onChange={onChange} className="border border-[#000000]/17 w-full lg:w-72 px-2 cursor-pointer outline-none h-10 rounded-lg">
//                     <option value="">Todos</option>
//                     <option value="Ativos">Ativos</option>
//                     <option value="Suspensos">Suspensos</option>
//                     <option value="Pendentes">Pendentes</option>
//                 </select>
//             </section>
//         ) : tipo === "cursos" ?(
//             <section className="flex flex-col">
//                 <label className="mb-3 ">{lbl ? "Cursos" : ''}</label>
//                 <select value={value} onChange={onChange} className="border border-[#000000]/17 w-full lg:w-72 px-2 cursor-pointer outline-none h-10 rounded-lg">
//                     <option value="">Todos os cursos</option>
//                     <option value="IG">IG</option>
//                     <option value="II">II</option>
//                     <option value="MM">MM</option>
//                     <option value="QA">QA</option>
//                 </select>
//             </section>
//         ) : tipo === "estadoemprestimo" ?(
//             <section className="flex flex-col">
//                 <label className="mb-3 ">{lbl ? "Estado" : ''}</label>
//                 <select value={value} onChange={onChange} className="border border-[#000000]/17 w-full lg:w-72 px-2 cursor-pointer outline-none h-10 rounded-lg">
//                     <option value="">Todos os estados</option>
//                     <option value="Atrasado">Em atraso</option>
//                     <option value="Danos">Danos</option>
//                     <option value="Perda">Perda</option>
//                 </select>
//             </section>
//         ) : (
//             null
//         )}

//         </section>
//     )
// }
// export default Select;


function Select({ tipo, value, onChange, lbl }) {

    const optionsMap = {
        categoria: [
            { value: "", label: "Todas as categorias" },
            { value: "Tecnologia", label: "Tecnologia" },
            { value: "Ciência", label: "Ciência" },
            { value: "Arte", label: "Arte" },
            { value: "Cultura", label: "Cultura" },
            { value: "Cultura e História", label: "Cultura e História" },
            { value: "Cultura e Romance", label: "Cultura e Romance" },
        ],
        estado: [
            { value: "", label: "Todos os Status" },
            { value: "Disponível", label: "Disponível" },
            { value: "Emprestado", label: "Emprestado" },
            { value: "Reservado", label: "Reservado" },
            { value: "Pendente", label: "Pendente" },
        ],
        todos: [
            { value: "", label: "Todos" },
            { value: "Ativos", label: "Ativos" },
            { value: "Suspensos", label: "Suspensos" },
            { value: "Pendentes", label: "Pendentes" },
        ],
        cursos: [
            { value: "", label: "Todos os cursos" },
            { value: "IG", label: "IG" },
            { value: "II", label: "II" },
            { value: "MM", label: "MM" },
            { value: "QA", label: "QA" },
        ],
        estadoemprestimo: [
            { value: "", label: "Todos os estados" },
            { value: "Atrasado", label: "Em atraso" },
            { value: "Danos", label: "Danos" },
            { value: "Perda", label: "Perda" },
        ],
    };

  const options = optionsMap[tipo];

  if (!options) return null;

  return (
    <div className="flex flex-col w-full md:w-64">
      
      {lbl && (
        <label className="mb-2 text-sm font-medium">
          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        className="
          w-full
          px-3
          h-10
          rounded-xl cursor-pointer
          border border-black/10
          bg-white
          text-sm
          focus:ring-2 focus:ring-[#f97b17]
          outline-none
        "
      >
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

    </div>
  );
}

export default Select;