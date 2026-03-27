// frontend/src/components/ChatAI.jsx
import { useState } from "react";
import api from "../api/api";


export default function ChatAI() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSend = async () => {
    try {
      const res = await api.post(
        "/ia/chat/",
        { prompt });
      setAnswer(res.data.response);
    } catch (err) {
      console.error(err);
      setAnswer("Erro ao processar a IA.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Digite sua pergunta para a IA..."
        className="w-full p-2 border rounded-md"
      />
      <button
        onClick={handleSend}
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
      >
        Perguntar
      </button>
      {answer && <div className="mt-4 p-3 bg-gray-50 rounded-md">{answer}</div>}
    </div>
  );
}