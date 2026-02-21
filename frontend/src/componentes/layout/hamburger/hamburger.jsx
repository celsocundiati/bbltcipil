import { NavLink } from "react-router-dom";
import { camposBotton, camposMain } from "../campos/campos";
import { LuBookOpen } from "react-icons/lu";

function Hamburger({ isOpen, setIsOpen }) {

  const est_inativo = "text-[#000000]/57 hover:text-[#000000]/80 hover:bg-[#000000]/5";
  const est_Ativo = "bg-[#f97b17]/35 text-[#f97b17]";

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 bottom-0 w-82 bg-white z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          border-r border-black/15
        `}
      >
        <div className="flex items-center gap-1 px-5 py-7 border-b border-black/15">
          <LuBookOpen className="bg-[#f97b17] size-12 text-white p-2.5 rounded-xl"/>
          <div>
            <h2 className="text-black/70 text-lg">
              Administração IPIL
              <span className="text-sm text-black/60 block">
                Sistema de Gestão
              </span>
            </h2>
          </div>
        </div>

        <nav className="p-5 space-y-5">
          {camposMain.map(campo => (
            <NavLink
              key={campo.caminho}
              to={campo.caminho}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center font-semibold gap-2 py-2 px-3 rounded-lg text-sm transition
                ${isActive ? est_Ativo : est_inativo}`
              }
            >
              {campo.icone} {campo.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1"></div>

        <nav className="px-5 space-y-5 pb-4">
          {camposBotton.map(campo => (
            <NavLink
              key={campo.caminho}
              to={campo.caminho}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center font-semibold gap-2 py-2 px-3 rounded-lg text-sm transition
                ${isActive ? est_Ativo : est_inativo}`
              }
            >
              {campo.icone} {campo.label}
            </NavLink>
          ))}
        </nav>

      </aside>
    </>
  );
}

export default Hamburger;