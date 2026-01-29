import { useState } from 'react';
import { MdPersonOutline } from 'react-icons/md';

function ImagemUpload() {
  const [imagem, setImagem] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagem(imageUrl);
    }
  };
  return (
    <section>
      {/* Input invisível por cima */}
      <input
        type="file"
        accept="imagem/*"
        className="absolute mt-20 ms-5 top-0 opacity-0 z-10 cursor-pointer w-24 h-24"
        onChange={handleImageChange}
      />

      {/* Se houver imagem, mostra a imagem */}
      {imagem ? (
        <img
          src={imagem}
          alt="profile"
          className="w-24 h-24 rounded-full mt-20 ms-5 absolute top-0 border-5 border-white object-cover"
        />
      ) : (
        // Caso não tenha imagem, mostra o botão
        <button className="cursor-pointer w-24 h-24 rounded-full mt-20 ms-5 
            absolute top-0 flex items-center justify-center bg-white text-[#F86417] 
            border-2 border-white">
            <MdPersonOutline size={70}/>
        </button>
      )}
      
    </section>
    )
}

export default ImagemUpload;