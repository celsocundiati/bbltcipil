import ListaNotificacoes from "../../layout/tables/tabnotificacoes/TabNotificacoes";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function Notificacoes() {
  return (
    <section className="relative min-h-screen p-4">

      {/* Botão voltar */}
      <div className="absolute top-4 left-4">
        <Link to="/perfil">
          <FiArrowLeft size={30} />
        </Link>
      </div>

      {/* Lista de notificações */}
      <section className='my-10'>
        <ListaNotificacoes />
      </section>
    </section>
  );
}

export default Notificacoes;