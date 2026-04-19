import InputGroup from "../../tags/inputs/InputGroup";
import { Link } from "react-router-dom";
import { HiOutlineBell, HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { useAuth } from "../../auth/userAuth/useauth";
import { obterIniciais } from "../tables/utilitarios/Utils";
import Permissao from "../../auth/hooks/gerir/gerenciamento";

function AdminNav() {
  const { user } = useAuth(); // usa o logout do AuthContext


  const priv = user?.user || {};
  // const info = user?.dados_oficiais || {};
  const nome = priv?.first_name || priv?.username || "Usuário";

  if (!user) {
    return <div className="p-10 text-center">Carregando usuário...</div>;
  }

  // Subtítulo baseado em superuser ou grupos
  let subtitulo = "";
  if (priv?.is_superuser) {
    subtitulo = "Super User";
  } else if (Array.isArray(priv?.grupos) && priv.grupos.length > 0) {
    subtitulo = priv.grupos.map(g => g?.nome || g).join(", ");
  } else {
    subtitulo = "Usuário";
  }

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

        {/* Ícones + Perfil */}
        <section className="flex items-center gap-5 ml-auto">


          <div className="flex items-center gap-5">

            
            <Permissao>
              <Link to="/admin/audit-log">
                <HiOutlineBell
                  size={26}
                  className="hover:text-[#F97B17] transition"
                />
              </Link>
            </Permissao>     

            <Link to="/assistente">
              <HiOutlineQuestionMarkCircle
                size={26}
                className="hover:text-[#F97B17] cursor-pointer transition"
              />
            </Link>
          </div>

          {/* Perfil - versão compacta no mobile */}
          <Link to="/perfil" className="flex items-center gap-3">

            <div className="flex items-center justify-center rounded-full w-10 h-10 md:w-12 md:h-12 bg-[#f97b17] text-white text-lg md:text-xl">
              {obterIniciais(nome)}
            </div>

            {/* Nome escondido no mobile */}
            <div className="hidden md:flex flex-col font-semibold">
              <span className="text-base">{nome}</span>
              <span className="text-black/70 text-sm">
                {subtitulo}
              </span>
            </div>

          </Link>
        </section>
      </div>
    </header>
  );
}

export default AdminNav;