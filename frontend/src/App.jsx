import Casa from './componentes/usuario/casa/casa'
import Catalogo from './componentes/usuario/catalogo/catalogo'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Reservas from './componentes/usuario/reservas/reservas';
import Exposicao from './componentes/usuario/exposicao/exposicao';
import Perfil from './componentes/usuario/perfil/perfil';
import Detalhes from './componentes/usuario/cards/cardsLivros/detalhes/detalheee';
import Dashboard from './componentes/admin/dashboard/dashboardadm';
import GestaoLivros from './componentes/admin/gestao/gestaolivros';
import AddLivro from './componentes/admin/addlivro/AddLivro';
import Emprestimos from './componentes/admin/emprestimos/emprestimos';
import Acervo from './componentes/admin/acervo/Acervo';
import CategoriasAutores from './componentes/admin/categorias_autores/catautores';
import Relatorios from './componentes/admin/relatorios/Relatorios';
import Admins from './componentes/admin/admins/admins';
import Sair from './componentes/auth/sair/sair';
import Admin from './componentes/admin/administrador';
import Multas from './componentes/admin/multas/multa';
import Estudantes from './componentes/admin/estudantes/estudantess';
import EditarLivro from './componentes/admin/editarlivro/editarlivro';
import CadastroAluno from './componentes/auth/cadastro/cadastro';
import LoginPage from './componentes/auth/login/login';
import AdminAuditLog from './componentes/admin/notificacaoadmin/notificacaoadmin';
import AlterarSenha from './componentes/auth/alterarsenha/alterarsenha';
import Privacidade from './componentes/auth/privacidadeuser/privacidade';
import PrivateRoute from './componentes/auth/rotasprivadas/rotasprivadas';
import AdminRoute from './componentes/auth/adminrotas/adminrotas';
import Configuracoesadmin from './componentes/admin/configuracoes/configuracoes';
import PasswordResetForm from './componentes/auth/recuperacaosenhas/recuperacaosenhas';
import ResetPasswordPage from './componentes/auth/recuperacaoconfirme/resetsenha';
import Notificacoes from './componentes/usuario/notificacoes/notificacoes';


function App() {

  return (
        <Router>
          <Routes>

            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroAluno />} />
            <Route path="/recuperacaosenha" element={<PasswordResetForm />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />

            {/* Rotas privadas */}
            <Route path="/" element={<PrivateRoute><Casa /></PrivateRoute>} />
            <Route path="/catalogo" element={<PrivateRoute><Catalogo /></PrivateRoute>} />
            <Route path="/reservas" element={<PrivateRoute><Reservas /></PrivateRoute>} />
            <Route path="/exposicao" element={<PrivateRoute><Exposicao /></PrivateRoute>} />
            <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
            <Route path="/notificacoes" element={<PrivateRoute><Notificacoes /></PrivateRoute>} />
            <Route path="/alterar-senha" element={<PrivateRoute><AlterarSenha /></PrivateRoute>} />
            <Route path="/privacidade" element={<PrivateRoute><Privacidade /></PrivateRoute>} />

            <Route path="detalhes/:id" element={<PrivateRoute><Detalhes /></PrivateRoute>} />

            {/* Rotas admin */}
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="gestao" element={<GestaoLivros />} />
              <Route path="addlivro" element={<AddLivro />} />
              <Route path="livros/:id" element={<EditarLivro />} />
              <Route path="perfis" element={<Estudantes />} />
              <Route path="emprestimos" element={<Emprestimos />} />
              <Route path="multas" element={<Multas />} />
              <Route path="acervo" element={<Acervo />} />
              <Route path="categoriasautores" element={<CategoriasAutores />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="configuracoesadmin" element={<Configuracoesadmin />} />
              <Route path="admins" element={<Admins />} />
              <Route path="audit-log" element={<AdminAuditLog />} />
              <Route path="" element={<Sair />} />
            </Route>
          </Routes>
        </Router>

  )
}

export default App;
