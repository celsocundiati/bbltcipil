export default function Skeleton({ type = "card", count = 1 }) {
  
  const renderCard = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-md overflow-hidden animate-pulse">

          <div className="h-60 bg-gray-200 w-full"></div>

          <div className="p-3 space-y-3">
            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
            <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>

        </div>
      ))}
    </div>
  );

//   const renderTable = () => (
//     <div className="space-y-3 animate-pulse">
//       {[...Array(count)].map((_, i) => (
//         <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
//       ))}
//     </div>
//   );

  const renderTable = ({ rows = 6, cols = 7 }) => (
    <div className="w-full">

        {[...Array(rows)].map((_, i) => (
        <div
            key={i}
            className="grid border-b border-black/10 py-3 px-2 gap-4"
            style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
            }}
        >

            {[...Array(cols)].map((_, j) => (
            <div key={j} className="flex justify-center">
                {j === cols - 1 ? (
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                ) : (
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                )}
            </div>
            ))}

        </div>
        ))}

    </div>
  );


  const renderDetail = () => (
    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 animate-pulse">

      <div className="bg-gray-200 h-96 w-full sm:max-w-100 rounded-2xl"></div>

      <div className="space-y-6">
        <div className="h-6 bg-gray-200 w-2/3 rounded"></div>

        <div className="grid grid-cols-2 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 w-full rounded"></div>
          <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
          <div className="h-4 bg-gray-200 w-4/6 rounded"></div>
        </div>
      </div>
    </div>
  );

  const renderCardEventoExposicao = () => (
    <div className="grid grid-cols-1 gap-6 w-full">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-black/10 rounded-md overflow-hidden animate-pulse"
        >
          {/* IMAGEM */}
          <div className="h-72 w-full bg-gray-200"></div>

          {/* CONTEÚDO */}
          <div className="p-5 space-y-4">

            {/* TITULO */}
            <div className="h-6 bg-gray-200 w-2/3 rounded"></div>

            {/* DESCRIÇÃO */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 w-full rounded"></div>
              <div className="h-3 bg-gray-200 w-5/6 rounded"></div>
              <div className="h-3 bg-gray-200 w-4/6 rounded"></div>
            </div>

            {/* INFO (data/local) */}
            <div className="space-y-3 pt-2">
              <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
              <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
            </div>

            {/* BOTÕES */}
            <div className="flex gap-4 pt-3">
              <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );

//   if (type === "table") return renderTable();
  if (type === "table") return renderTable({ rows: count, cols: 7 });
  if (type === "detail") return renderDetail();
  if (type === "cardexposicaoexvento") return renderDetail();

  return renderCard();
}


