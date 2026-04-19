import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaPaperPlane, FaBars } from "react-icons/fa";
import api from "../../service/api/api";

function Assistente() {

    const [chats, setChats] = useState([]);
    const [chatAtual, setChatAtual] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [digitando, setDigitando] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const chatRef = useRef(null);

    useEffect(() => {
        carregarChats();
    }, []);

const carregarChats = async () => {
    try {
        const res = await api.get("/ai/chat/listar/");

        if (Array.isArray(res.data) && res.data.length > 0) {
            const chatsFormatados = res.data.map(c => ({
                id: c.id,
                mensagens: []
            }));

            setChats(chatsFormatados);

            const primeiro = chatsFormatados[0];
            setChatAtual(primeiro.id);

            await carregarMensagens(primeiro.id);

        } else {
            await novoChat();
        }

    } catch (err) {
        console.log(err);
    }
};

    const carregarMensagens = async (chatId) => {
    try {
        const res = await api.get(`/ai/chat/${chatId}/mensagens/`);

        setChats(prev =>
            prev.map(chat =>
                chat.id === chatId
                    ? { ...chat, mensagens: res.data || [] }
                    : chat
            )
        );

    } catch (err) {
        console.log(err);
    }
};

    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [chats, digitando, chatAtual]);

    const mensagensAtuais =
        chats.find(c => c.id === chatAtual)?.mensagens || [];

    const novoChat = async () => {
    try {
        const res = await api.post("/ai/chat/criar/");

        const novo = {
            id: res.data.chat_id,
            mensagens: []
        };

        setChats(prev => [novo, ...prev]);
        setChatAtual(novo.id);

        setSidebarOpen(false);

    } catch (err) {
        console.log(err);
    }
};

    const selecionarChat = async (id) => {
        setChatAtual(id);
        setSidebarOpen(false);
        await carregarMensagens(id);
    };

    const escreverResposta = (texto) => {
        let i = 0;
        let resposta = "";

        const intervalo = setInterval(() => {
            resposta += texto[i];

            setChats(prev =>
                prev.map(chat => {
                    if (chat.id !== chatAtual) return chat;

                    const msgs = [...chat.mensagens];

                    if (msgs.length > 0) {
                        msgs[msgs.length - 1].texto = resposta;
                    }

                    return { ...chat, mensagens: msgs };
                })
            );

            i++;
            if (i === texto.length) clearInterval(intervalo);

        }, 15);
    };

    const enviarMensagem = async () => {
    if (!mensagem.trim()) return;

    const texto = mensagem;
    setMensagem("");

    const novasMensagens = [
        ...mensagensAtuais,
        { tipo: "user", texto },
        { tipo: "ia", texto: "" }
    ];

    setChats(prev =>
        prev.map(chat =>
            chat.id === chatAtual
                ? { ...chat, mensagens: novasMensagens }
                : chat
        )
    );

    setDigitando(true);

    try {
        const res = await api.post("/ai/chat/enviar/", {
            chat_id: chatAtual,
            mensagem: texto
        });

        escreverResposta(res.data.resposta);

    } catch (err) {
        console.log(err);
        escreverResposta("Erro ao comunicar com o servidor");
    }

    setDigitando(false);
};

    const reconhecerVoz = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Sem suporte a voz");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "pt-PT";

        recognition.onresult = (event) => {
            setMensagem(event.results[0][0].transcript);
        };

        recognition.start();
    };

    return (
        <div className="w-full h-screen flex bg-gray-100">

            <div className={`fixed md:relative z-20 ${sidebarOpen ? "left-0" : "-left-64"} md:left-0 w-64 h-full bg-white border-r border-gray-200 flex flex-col p-4 transition-all duration-300`}>

                <button
                    onClick={novoChat}
                    className="bg-orange-500 text-white py-2 rounded-lg mb-4"
                >
                    + Novo Chat
                </button>

                <div className="flex-1 overflow-y-auto space-y-2">
                    {chats.map(chat => {
                        const titulo =
                            chat.mensagens?.find(m => m.tipo === "user")?.texto?.slice(0, 30)
                            || "Nova conversa";

                        return (
                            <div
                                key={chat.id}
                                onClick={() => selecionarChat(chat.id)}
                                className={`p-2 rounded-lg cursor-pointer text-sm ${chatAtual === chat.id ? "bg-orange-100" : "hover:bg-gray-100"}`}
                            >
                                {titulo}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 flex flex-col">

                <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(true)} className="md:hidden">
                        <FaBars />
                    </button>

                    <span className="font-semibold text-gray-700">
                        Assistente
                    </span>
                </div>

                <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

                    {mensagensAtuais.map((msg, index) => (
                        <div
                            key={index}
                            style={{ whiteSpace: "pre-line" }}
                            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.tipo === "user" ? "ml-auto bg-gray-200" : "bg-orange-500 text-white"}`}
                        >
                            {msg.texto}
                        </div>
                    ))}

                    {digitando && (
                        <div className="flex items-end gap-1 h-6">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    )}

                </div>

                <div className="border-t border-gray-200 bg-white flex justify-center items-center px-2 py-2">

                    <div className="w-full max-w-2xl flex items-center gap-2">

                        <button onClick={reconhecerVoz} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-orange-500">
                            <FaMicrophone size={16} />
                        </button>

                        <input
                            type="text"
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
                            placeholder="Pergunte o que precisas saber..."
                            className="flex-1 bg-gray-200 rounded-full px-4 py-2 text-sm outline-none"
                        />

                        <button
                            onClick={enviarMensagem}
                            className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"
                        >
                            <FaPaperPlane size={14} />
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Assistente;