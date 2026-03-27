// components/HelpChatIcon.jsx
import { FaRobot } from "react-icons/fa"; // ícone de IA/chatbot
import { useNavigate } from "react-router-dom";

export default function HelpChatIcon() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chat-ai"); // rota do seu ChatBot
  };

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-30 right-6 z-50 w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:bg-orange-600 transition-colors"
      title="Precisa de ajuda? Fale com a IA"
    >
      <FaRobot className="w-8 h-8" />
    </div>
  );
}