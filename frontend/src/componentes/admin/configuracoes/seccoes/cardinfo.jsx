import { useEffect, useState } from "react";
import HeaderCardInfo from "./headcard";
import { FiPhone } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import api from "../../../service/api/api";
import { useAuth } from "../../../auth/userAuth/useauth";
import { podeGerir } from "../../../auth/podegerir/permissao";
import Toast from "../../../usuario/stylenotificacao/toast";



function CardInfo() {

  const [formData, setFormData] = useState({
    limite_reservas_ativas: 0,
    limite_reservas_uso: 0,
    limite_reservas_mensal: 0,
    dias_emprestimo: 0,
    limite_livros_estudante: 0,
    cobranca_ativa: true,
    multa_por_dia: 0,
    multa_por_dano: 0,
    multa_por_perda_ou_dano: 0,
    horario_semana_abertura: "08:00",
    horario_semana_fecho: "16:00",
    horario_fim_semana_abertura: "08:00",
    horario_fim_semana_fecho: "12:00",
    email: "",
    telefone: ""
  });

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarTelefone = (tel) => /^\d{9}$/.test(tel);

  // 🔥 CAMPOS NUMÉRICOS
  const numericFields = [
    "limite_reservas_ativas",
    "limite_reservas_uso",
    "limite_reservas_mensal",
    "dias_emprestimo",
    "limite_livros_estudante",
    "multa_por_dia",
    "multa_por_perda_ou_dano",
    "dias_tolerancia"
  ];

  // 🔄 CARREGAR CONFIG
  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        const res = await api.get("/admin/configuracoes/");
        setFormData(res.data);
      } catch (error) {
        console.error(error);
        setToast({
          message: "Erro ao carregar configurações",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  // 🧠 HANDLE CHANGE (VALIDAÇÃO SEM QUEBRAR UI)
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }

    if (numericFields.includes(name)) {

      if (value === "") {
        setFormData(prev => ({
          ...prev,
          [name]: ""
        }));
        return;
      }

      // remove tudo que não é número
      const cleaned = value.replace(/[^0-9]/g, "");
      const num = Number(cleaned);

      if (num < 0) {
        setToast({
          message: "Não são permitidos valores negativos.",
          type: "error",
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        [name]: num
      }));

      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // 💾 SUBMIT VALIDADO
  async function handleSubmit(e) {
    e.preventDefault();

    if (!podeGerir(user)) return;

    if (!validarEmail(formData.email)) {
      setToast({ message: "Email inválido.", type: "error" });
      return;
    }

    if (!validarTelefone(formData.telefone)) {
      setToast({ message: "Telefone inválido (9 dígitos).", type: "error" });
      return;
    }

    // validação final anti-negativos
    for (let field of numericFields) {
      const value = Number(formData[field]);

      if (isNaN(value) || value < 0) {
        setToast({
          message: `Valor inválido no campo ${field}`,
          type: "error",
        });
        return;
      }
    }

    try {
      setLoading(true);

      await api.put("/admin/configuracoes/1/", formData);

      setToast({
        message: "Configurações atualizadas com sucesso",
        type: "success",
      });

    } catch (error) {
      console.error(error);

      const data = error.response?.data;

      let message = "Erro de ligação ao servidor.";

      if (data?.detail) {
        message = data.detail;
      } else if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const firstError = data[firstKey];

        message = Array.isArray(firstError)
          ? firstError[0]
          : firstError;
      } else if (error.message) {
        message = error.message;
      }

      setToast({
        message,
        type: "error",
      });

    } finally {
      setLoading(false);
    }
  }


  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
      {/* RESERVAS */}
      <section className="w-full border border-black/10 rounded-lg">
        <HeaderCardInfo tipo="reservas" />

        <article className="grid md:grid-cols-3 gap-6 p-5">

          <div>
            <h3>Reservas Ativas</h3>
            <input
              type="number"
              name="limite_reservas_ativas"
              value={formData.limite_reservas_ativas}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-[#f97b17]"
            />
          </div>

          <div>
            <h3>Reservas em Uso</h3>
            <input
              type="number"
              name="limite_reservas_uso"
              value={formData.limite_reservas_uso}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-[#f97b17]"
            />
          </div>

          <div>
            <h3>Reservas Mensais</h3>
            <input
              type="number"
              name="limite_reservas_mensal"
              value={formData.limite_reservas_mensal}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-[#f97b17]"
            />
          </div>

        </article>
      </section>

      {/* EMPRÉSTIMOS */}
      <section className="w-full border border-black/10 rounded-lg">
        <HeaderCardInfo tipo="emprestimos" />

        <article className="grid md:grid-cols-2 gap-6 p-5">

          <div>
            <h3>Dias Padrão</h3>
            <input
              type="number"
              name="dias_emprestimo"
              value={formData.dias_emprestimo}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]"
            />
          </div>

          <div>
            <h3>Limite de Livros</h3>
            <input
              type="number"
              name="limite_livros_estudante"
              value={formData.limite_livros_estudante}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]"
            />
          </div>

        </article>
      </section>

      {/* MULTAS */}
      <section className="w-full border border-black/10 rounded-lg">
        <HeaderCardInfo tipo="multas" />

        <article className="grid md:grid-cols-3 gap-6 p-5">

          <div className="md:col-span-3 flex items-center justify-between p-4 bg-black/3 rounded-2xl border border-black/5">
            <div>
              <h3 className="font-medium">Cobrança de Multas</h3>
              <p className="text-sm text-gray-500">
                Ativar ou desativar cobranças manualmente
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="cobranca_ativa"
                checked={formData.cobranca_ativa}
                onChange={handleChange}
                className="sr-only peer"
              />

              <div
                className="
                  w-14 h-7 bg-gray-300 rounded-full
                  peer peer-checked:bg-green-500
                  after:content-['']
                  after:absolute
                  after:top-1
                  after:left-1
                  after:bg-white
                  after:w-5
                  after:h-5
                  after:rounded-full
                  after:transition-all
                  peer-checked:after:translate-x-7
                "
              ></div>
            </label>
          </div>
          
          <div>
            <h3>Multa por dia</h3>
            <input type="number" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" 
              name="multa_por_dia" value={formData.multa_por_dia} onChange={handleChange} />
          </div>

          
          <div>
            <h3>Multa por dano ou perda</h3>
            <input type="number" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" 
              name="multa_por_dano" value={formData.multa_por_perda_ou_dano} onChange={handleChange} />
          </div>
          
          <div>
            <h3>Total de dias de tolerância para criação de multas</h3>
            <input type="number" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" 
              name="multa_por_perda" value={formData.dias_tolerancia} onChange={handleChange} />
          </div>

        </article>
      </section>

      {/* HORÁRIOS */}
      <section className="w-full border border-black/10 rounded-lg">
        <HeaderCardInfo tipo="horarios" />

        <article className="grid md:grid-cols-4 gap-6 p-5">

          <div>
            <h3>Dias de Semana abertura</h3>
            <input type="time" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" name="horario_semana_abertura" 
              value={formData.horario_semana_abertura} onChange={handleChange} />
          </div>
          
          <div>
            <h3>Dias de semana fechamento</h3>
            <input type="time" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" 
              name="horario_semana_fecho" 
              value={formData.horario_semana_fecho} onChange={handleChange} />
          </div>

          
          <div>
            <h3>Dias de Semana abertua</h3>
            <input type="time" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" 
              name="horario_fim_semana_abertura" 
              value={formData.horario_fim_semana_abertura} onChange={handleChange} />
          </div>
          
          <div>
            <h3>Fins de semana fechamento</h3>
            <input type="time" 
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]" 
              name="horario_fim_semana_fecho" 
              value={formData.horario_fim_semana_fecho} onChange={handleChange} />
          </div>

        </article>
      </section>

      {/* CONTACTOS */}
      <section className="w-full border border-black/10 rounded-lg">
        <HeaderCardInfo tipo="dados" />

        <article className="grid md:grid-cols-2 gap-6 p-5">

          <div className="flex items-center gap-2">
            <AiOutlineMail />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]"
            />
          </div>

          <div className="flex items-center gap-2">
            <FiPhone />
            <input
              type="text"
              required
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl flex items-center outline-none focus-within:ring-2 focus-within:ring-[#f97b17]"
            />
          </div>

        </article>
      </section>

      {/* BOTÕES */}
      
      {((podeGerir(user)) && 
        <div className="w-full flex flex-col md:flex-row justify-end items-center gap-4 pb-10">
          <button type="button" 
            className="w-full md:w-auto border border-black/15 hover:bg-black/5 bg-white py-2 px-6 rounded-xl text-black cursor-pointer transition outline-none"
            >Cancelar</button>
          <button type="submit" disabled={loading} 
            className="w-full md:w-auto bg-[#F97B17] hover:bg-[#F86417] py-2 px-6 rounded-xl text-white cursor-pointer transition outline-none">
            {loading ? "Salvando..." : "Guardar Alterações"}
          </button>
        </div>
      )}

      {toast && (
          <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          />
      )}

    </form>
  );
}

export default CardInfo;



