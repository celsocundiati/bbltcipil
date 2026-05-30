import { useState } from "react";
import { MdPersonOutline } from "react-icons/md";
import api from "../../../service/api/api";
import { useAuth } from "../../../auth/userAuth/useauth";

function ImagemUpload({ fotoAtual }) {

    const { user, setUser } = useAuth();

    const [imagem, setImagem] = useState(
      fotoAtual || null
    );

    const handleImageChange = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        // Preview instantâneo
        const imageUrl = URL.createObjectURL(file);

        setImagem(imageUrl);

        try {

            const formData = new FormData();

            formData.append("foto", file);

            const response = await api.patch(
                "/accounts/me/",
                formData
            );

            // URL REAL do Cloudinary
            const fotoCloudinary =
                response.data?.perfil?.foto;

            // Atualiza preview
            if (fotoCloudinary) {
                setImagem(fotoCloudinary);
            }

            // Atualiza contexto global
            setUser(response.data);

        } catch (error) {

            console.log(
                error.response?.data || error
            );
        }
    };

    return (
        <section>

            {/* Input invisível por cima */}
            <input
                type="file"
                accept="image/*"
                className="absolute mt-20 ms-5 top-0 opacity-0 z-10 cursor-pointer w-24 h-24"
                onChange={handleImageChange}
            />

            {/* Se houver imagem */}
            {imagem ? (

                <img
                    src={imagem}
                    alt="profile"
                    className="w-24 h-24 rounded-full mt-20 ms-5 absolute top-0 border-5 border-white object-cover"
                />

            ) : (

                <button
                    className="
                        cursor-pointer
                        w-24
                        h-24
                        rounded-full
                        mt-20
                        ms-5
                        absolute
                        top-0
                        flex
                        items-center
                        justify-center
                        bg-white
                        text-[#F86417]
                        border-2
                        border-white
                    "
                >

                    <MdPersonOutline size={70} />

                </button>
            )}

        </section>
    );
}

export default ImagemUpload;