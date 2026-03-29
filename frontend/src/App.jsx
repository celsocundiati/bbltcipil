// ==========================
// 🔹 App.jsx (rotas refinadas)
// ==========================
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RoleRoute } from "./componentes/auth/adminrotas/adminrotas";

// Componentes Usuário
import Casa from './componentes/usuario/casa/casa';
import Catalogo from './componentes/usuario/catalogo/catalogo';
import Reservas from './componentes/usuario/reservas/reservas';
import Exposicao from './componentes/usuario/exposicao/exposicao';
import Perfil from './componentes/usuario/perfil/perfil';
import Notificacoes from './componentes/usuario/notificacoes/notificacoes';
import Detalhes from "./componentes/usuario/cards/cardsLivros/detalhes/detalheee";
import ChatAI from './componentes/service/chatbot/chatbot';
import AlterarSenha from './componentes/auth/alterarsenha/alterarsenha';
import Privacidade from './componentes/auth/privacidadeuser/privacidade';
import LoginPage from './componentes/auth/login/login';
import CadastroAluno from './componentes/auth/cadastro/cadastro';
import PasswordResetForm from './componentes/auth/recuperacaosenhas/recuperacaosenhas';
import ResetPasswordPage from './componentes/auth/recuperacaoconfirme/resetsenha';

// Componentes Admin
import Admin from './componentes/admin/administrador';
import Dashboard from './componentes/admin/dashboard/dashboardadm';
import GestaoLivros from './componentes/admin/gestao/gestaolivros';
import AddLivro from './componentes/admin/addlivro/AddLivro';
import EditarLivro from './componentes/admin/editarlivro/editarlivro';
import Emprestimos from './componentes/admin/emprestimos/emprestimos';
import Acervo from './componentes/admin/acervo/Acervo';
import CategoriasAutores from './componentes/admin/categorias_autores/catautores';
import Relatorios from './componentes/admin/relatorios/Relatorios';
import Admins from './componentes/admin/admins/admins';
import Configuracoesadmin from './componentes/admin/configuracoes/configuracoes';
import Multas from './componentes/admin/multas/multa';
import Estudantes from './componentes/admin/estudantes/estudantess';
import AdminAuditLog from './componentes/admin/notificacaoadmin/notificacaoadmin';
import Sair from './componentes/auth/sair/sair';

// Rotas privadas padrão
import PrivateRoute from './componentes/auth/rotasprivadas/rotasprivadas';

function App() {
  return (
    <Router>
      <Routes>

        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroAluno />} />
        <Route path="/recuperacaosenha" element={<PasswordResetForm />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />

        {/* Rotas Usuário */}
        <Route path="/" element={<PrivateRoute><Casa /></PrivateRoute>} />
        <Route path="/catalogo" element={<PrivateRoute><Catalogo /></PrivateRoute>} />
        <Route path="/detalhes/:id" element={<PrivateRoute><Detalhes /></PrivateRoute>} />
        <Route path="/reservas" element={<PrivateRoute><Reservas /></PrivateRoute>} />
        <Route path="/exposicao" element={<PrivateRoute><Exposicao /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="/notificacoes" element={<PrivateRoute><Notificacoes /></PrivateRoute>} />
        <Route path="/alterar-senha" element={<PrivateRoute><AlterarSenha /></PrivateRoute>} />
        <Route path="/privacidade" element={<PrivateRoute><Privacidade /></PrivateRoute>} />
        <Route path="/chat-ai" element={<PrivateRoute><ChatAI /></PrivateRoute>} />

        {/* Rotas Admin (2 grupos tratados: Admin, Bibliotecárior) */}
        <Route path="/admin" element={
          <RoleRoute allowedRoles={["Admin", "Bibliotecario"]}>
            <Admin />
          </RoleRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="gestao" element={<GestaoLivros />} />
          
          <Route path="addlivro" element={
            <RoleRoute apenasAdmin={true}>
              <AddLivro />
            </RoleRoute>
          } />

          <Route path="livros/:id" element={
            <RoleRoute apenasAdmin={true}>
              <EditarLivro />
            </RoleRoute>
          } />
          
          <Route path="perfis" element={
            <RoleRoute apenasAdmin={true}>
              <Estudantes />
            </RoleRoute>
          } />

          <Route path="emprestimos" element={<Emprestimos />} />
          <Route path="multas" element={<Multas />} />
          <Route path="acervo" element={<Acervo />} />
          <Route path="categoriasautores" element={<CategoriasAutores />} />

          <Route path="relatorios" element={
            <RoleRoute apenasAdmin={true}>
              <Relatorios />
            </RoleRoute>
          } />

          <Route path="configuracoesadmin" element={<Configuracoesadmin />} />
          
          <Route path="admins" element={
            <RoleRoute apenasAdmin={true}>
              <Admins />
            </RoleRoute>
          } />
          {/* <Route path="admins" element={<Admins />} /> */}

          <Route path="audit-log" element={<AdminAuditLog />} />
          <Route path="" element={<Sair />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;