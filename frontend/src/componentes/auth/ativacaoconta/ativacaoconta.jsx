import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../service/api/api";

export default function AtivacaoConta() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token || hasRun.current) return;

    hasRun.current = true;

    async function ativarConta() {
      try {
        await api.get(`/accounts/verify-email/${token}/`);
        setStatus("success");

        setTimeout(() => {
          navigate("/login");
        }, 2500);

      } catch (err) {
        console.log(err);
        setStatus("error");
      }
    }

    ativarConta();
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen flex-col">
      {status === "loading" && (
        <p className="text-gray-600">A ativar a tua conta...</p>
      )}

      {status === "success" && (
        <p className="text-green-600 font-semibold">
          Conta ativada com sucesso! Vais ser redirecionado...
        </p>
      )}

      {status === "error" && (
        <p className="text-red-600 font-semibold">
          Link inválido ou expirado.
        </p>
      )}
    </div>
  );
}