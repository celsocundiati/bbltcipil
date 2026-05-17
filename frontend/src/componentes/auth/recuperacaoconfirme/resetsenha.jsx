// import { useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import Fundo from "../../../assets/bck.jpg";
// import api from "../../service/api/api";

// export default function ResetPasswordPage() {
//   const { uid, token } = useParams();
//   const navigate = useNavigate();

//   const [password, setPassword] = useState("");
//   const [passwordConfirm, setPasswordConfirm] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== passwordConfirm) {
//       setMessage("As senhas não coincidem!");
//       return;
//     }

//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await api.post("/accounts/password-reset-confirm/", {
//         uid,
//         token,
//         new_password: password,
//       });
//       setMessage("Senha redefinida com sucesso!");
//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err) {
//       console.error(err);
//       setMessage(err.response?.data?.error || "Erro ao redefinir senha");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative flex items-center justify-center min-h-screen overflow-hidden">

//       {/* BACKGROUND FIXO */}
//       <div className="absolute inset-0">
//         <img
//           src={Fundo}
//           className="w-full h-full object-cover object-center"
//           alt="background"
//         />
//       </div>

//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-medium text-[#F97B17]">Redefinir Senha</h1>
//           <p className="text-gray-500 mt-2">
//             Insira sua nova senha abaixo.
//           </p>
//         </div>
//         {message && (
//           <p
//             className={`text-center mb-4 font-medium ${
//               message.includes("Erro") || message.includes("não") ? "text-red-500" : "text-[#F97B17]"
//             }`}
//           >
//             {message}
//           </p>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-gray-700 mb-2">Nova senha</label>
//             <input
//               type="password"
//               placeholder="Digite a nova senha"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full p-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97B17]/80 placeholder-gray-400"
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700 mb-2">Confirme a nova senha</label>
//             <input
//               type="password"
//               placeholder="Confirme a nova senha"
//               value={passwordConfirm}
//               onChange={(e) => setPasswordConfirm(e.target.value)}
//               required
//               className="w-full p-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97B17]/80 placeholder-gray-400"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full p-3 rounded-lg font-semibold text-white transition-colors 
//               ${loading ? "bg-[#F97B17]/50 cursor-not-allowed" : "bg-[#F97B17] hover:bg-[#F97B17]/90"}`}
//           >
//             {loading ? "Processando..." : "Redefinir senha"}
//           </button>
//         </form>
//         <div className="mt-6 text-center text-gray-500 text-sm">
//           Lembrou sua senha?{" "}
//           <Link to="/login" className="text-[#F97B17] font-medium hover:underline">
//             Voltar para login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../service/api/api";
import Fundo from "../../../assets/bck.jpg";
import LogoIPIL from "../../../assets/ipillogo.png";

export default function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErro("");
    setMsg("");

    if (password !== passwordConfirm) {
      setErro("As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/accounts/password-reset-confirm/", {
        uid,
        token,
        new_password: password,
      });

      setMsg(res.data.message || "Senha redefinida com sucesso!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.log("ERRO RESET:", err.response?.data);

      setErro(
        err.response?.data?.error ||
        "Erro ao redefinir senha"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <img
          src={Fundo}
          className="w-full h-full object-cover object-center"
          alt="background"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" />

      {/* CARD */}
      <div className="bg-white/85 p-8 rounded-2xl shadow-lg w-full max-w-sm z-50">

        {/* LOGO */}
        <div className="flex justify-center">
          <img src={LogoIPIL} className="w-28 h-28" />
        </div>

        <h1 className="text-xl text-center font-medium text-[#F97B17] mb-2">
          Redefinir Senha
        </h1>

        <p className="text-center text-sm text-gray-600 mb-6">
          Define a tua nova senha de acesso
        </p>

        {/* ERROS / SUCCESS */}
        {erro && (
          <p className="text-red-600 text-center mb-3">
            {erro}
          </p>
        )}

        {msg && (
          <p className="text-green-600 text-center mb-3">
            {msg}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border bg-gray-300 border-black/10 h-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="px-4 py-2 border bg-gray-300 border-black/10 h-11 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white p-2 rounded-lg cursor-pointer"
          >
            {loading ? "Processando..." : "Redefinir senha"}
          </button>

        </form>

        {/* LINK */}
        <p className="text-center text-sm mt-4 text-gray-600">
          <Link to="/login" className="text-orange-500 font-medium">
            Voltar ao login
          </Link>
        </p>

      </div>
    </main>
  );
}