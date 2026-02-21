import Casa from './componentes/casa/casa'
import Catalogo from './componentes/catalogo/catalogo'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Reservas from './componentes/reservas/reservas';
import Exposicao from './componentes/exposicao/exposicao';
import Perfil from './componentes/perfil/perfil';
import Detalhes from './componentes/cards/cardsLivros/detalhes/detalheee';
import Dashboard from './componentes/admin/dashboard/dashboardadm';
import GestaoLivros from './componentes/admin/gestao/gestaolivros';
import AddLivro from './componentes/admin/addlivro/AddLivro';
import Emprestimos from './componentes/admin/emprestimos/emprestimos';
import Acervo from './componentes/admin/acervo/Acervo';
import CategoriasAutores from './componentes/admin/categorias_autores/catautores';
import Relatorios from './componentes/admin/relatorios/Relatorios';
import Admins from './componentes/admin/admins/admins';
import Configuracoesadmin from './componentes/admin/configuracoes/Configuracoes';
import Sair from './componentes/sair/sair';
import Admin from './componentes/admin/administrador';
import Multas from './componentes/admin/multas/multa';
import Estudantes from './componentes/admin/estudantes/estudantess';
import EditarLivro from './componentes/admin/editarlivro/editarlivro';
import CadastroAluno from './componentes/cadastro/cadastro';
import LoginPage from './componentes/login/login';
import axios from "axios";
import ListaNotificacoes from './componentes/layout/tables/tabnotificacoes/TabNotificacoes';

axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => {
  return Promise.reject(error);
});

function App() {

  return (
        <Router>
          <Routes>

            <Route path='/' element={<Casa />}/>
            <Route path='/cadastro' element={<CadastroAluno />}/>
            <Route path='/login' element={<LoginPage />}/>
            <Route path='/catalogo' element={<Catalogo />}/>
            <Route path='/reservas' element={<Reservas />}/>
            <Route path='/exposicao' element={<Exposicao />}/>
            <Route path='/perfil' element={<Perfil />}/>
            <Route path='/notificacoes' element={<ListaNotificacoes />}/>

            <Route path='detalhes/:id' element={<Detalhes />}/>

            <Route path='/admin' element={<Admin/>}>
              <Route index element={<Dashboard />}/>
              <Route path='dashboard' element={<Dashboard />}/>
              <Route path='gestao' element={<GestaoLivros />}/>
              <Route path='addlivro' element={<AddLivro />}/>
              <Route path='livros/:id' element={<EditarLivro />}/>
              <Route path='estudantes' element={<Estudantes />}/>
              <Route path='emprestimos' element={<Emprestimos />}/>
              <Route path='multas' element={<Multas />}/>
              <Route path='acervo' element={<Acervo />}/>
              <Route path='categoriasautores' element={<CategoriasAutores />}/>
              <Route path='relatorios' element={<Relatorios />}/>
              <Route path='configuracoesadmin' element={<Configuracoesadmin />}/>
              <Route path='admins' element={<Admins />}/>
              <Route path='' element={<Sair />}/>
            </Route>

          </Routes>
        </Router>

  )
}

export default App;
