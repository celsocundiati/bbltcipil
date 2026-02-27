import InputGroup from "../../tags/inputs/InputGroup";
import { Link } from "react-router-dom";
import { HiOutlineBell, HiOutlineQuestionMarkCircle } from "react-icons/hi2";

function AdminNav() {

  return (
    <header
      className="
        fixed top-0 right-0 left-0 
        md:left-82
        bg-white shadow z-40
        px-4 md:px-6 py-3
      "
    >
      <div className="flex items-center justify-between gap-4">

        {/* Pesquisa - escondida em mobile */}
        <div className="hidden md:block w-2/4">
          <InputGroup
            page="catalogo"
            type="text"
            placeholder="Busque por livros, estudantes e empréstimos"
          />
        </div>

        {/* Ícones + Perfil */}
        <section className="flex items-center gap-5 ml-auto">

          <div className="flex items-center gap-5">
            <Link to="/admin/audit-log">
              <HiOutlineBell
                size={26}
                className="hover:text-[#F97B17] transition"
              />
            </Link>

            <HiOutlineQuestionMarkCircle
              size={26}
              className="hover:text-[#F97B17] cursor-pointer transition"
            />
          </div>

          {/* Perfil - versão compacta no mobile */}
          <div className="flex items-center gap-3">

            <div className="flex items-center justify-center rounded-full w-10 h-10 md:w-12 md:h-12 bg-[#f97b17] text-white text-lg md:text-xl">
              CC
            </div>

            {/* Nome escondido no mobile */}
            <div className="hidden md:flex flex-col font-semibold">
              <span className="text-base">Celso Cristiano</span>
              <span className="text-black/70 text-sm">
                Super Admin
              </span>
            </div>

          </div>
        </section>
      </div>
    </header>
  );
}

export default AdminNav;