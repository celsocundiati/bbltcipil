import HeaderCardInfo from "./headcard";
import { FiPhone } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";

function CardInfo() {
  return (
    <main className="w-full flex flex-col gap-8 overflow-x-hidden">

      {/* EMPRÉSTIMOS */}
      <section className="w-full border border-black/10 rounded-lg min-h-[250px]">
        <HeaderCardInfo tipo="emprestimos" />
        <article className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          <div>
            <h3 className="font-semibold text-lg">
              Dias Padrão de Empréstimos
            </h3>
            <input
              type="number"
              required
              value={14}
              className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"
            />
            <p className="text-black/70 text-lg">
              Número de dias para a devolução
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Limites de Livros por Estudante
            </h3>
            <input
              type="number"
              required
              value={3}
              className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"
            />
            <p className="text-black/70 text-lg">
              Máximo de livros simultâneos
            </p>
          </div>
        </article>
      </section>

      {/* MULTAS */}
      <section className="w-full border border-black/10 rounded-lg min-h-[250px]">
        <HeaderCardInfo tipo="multas" />
        <article className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
          <div>
            <h3 className="font-semibold text-lg">
              Multas por Dias (kz)
            </h3>
            <input
              type="number"
              required
              value={500}
              className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"
            />
            <p className="text-black/70 text-lg">
              Por dia de atraso
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Multas por Danos (kz)
            </h3>
            <input
              type="number"
              required
              value={1500}
              className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"
            />
            <p className="text-black/70 text-lg">
              Por livro danificado
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Por livro perdido (kz)
            </h3>
            <input
              type="number"
              required
              value={5000}
              className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"
            />
            <p className="text-black/70 text-lg">
              Valor por perda definitiva
            </p>
          </div>
        </article>
      </section>

      {/* HORÁRIOS */}
      <section className="w-full border border-black/10 rounded-lg min-h-[250px]">
        <HeaderCardInfo tipo="horarios" />
        <article className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          <div>
            <h3 className="font-semibold text-lg">
              Dias de Semana
            </h3>
            <div className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center">
              08:00h - 16:00h
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Fins de Semana
            </h3>
            <div className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center">
              08:00h - 12:00h
            </div>
          </div>
        </article>
      </section>

      {/* DADOS */}
      <section className="w-full border border-black/10 rounded-lg min-h-[250px]">
        <HeaderCardInfo tipo="dados" />
        <article className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          <div>
            <h3 className="font-semibold text-lg">
              Email
            </h3>
            <div className="w-full flex items-center gap-2 h-10 px-5 py-2 my-2 bg-black/3 border border-black/5 rounded-2xl">
              <AiOutlineMail size={20} />
              <input
                type="email"
                required
                value="bibliotecaipil@gmail.com"
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Telefone
            </h3>
            <div className="w-full flex items-center gap-2 h-10 px-5 py-2 my-2 bg-black/3 border border-black/5 rounded-2xl">
              <FiPhone size={20} />
              <input
                type="number"
                required
                value={244974107262}
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>
        </article>
      </section>

      {/* BOTÕES */}
      <article className="w-full flex flex-col md:flex-row justify-end items-center gap-4 pb-10">
        <button
          type="button"
          className="w-full md:w-auto border border-black/15 hover:bg-black/5 bg-white py-2 px-6 rounded-xl text-black cursor-pointer transition"
        >
          Cancelar Alterações
        </button>

        <button
          type="submit"
          className="w-full md:w-auto bg-[#F97B17] hover:bg-[#F86417] py-2 px-6 rounded-xl text-white cursor-pointer transition"
        >
          Guardar Alterações
        </button>
      </article>

    </main>
  );
}

export default CardInfo;