import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell} from "recharts";

function Grafic({variant, data, xkey, lines, barkey})
{
    return(
        <ResponsiveContainer width="100%" height={300} >
        {variant === "line" ?(
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xkey} />
                <YAxis />
                <Tooltip />
                 {lines.map((line, index) => (
                    <Line key={index} type="monotone" dataKey={line.dataKey} stroke={line.color} strokeWidth={line.width ?? 2} dot={false} />
                ))}
            </LineChart>
        ) : variant === "bar" ?(
            <BarChart data={data} >
                <XAxis dataKey={xkey} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={barkey} radius={[8, 8, 0, 0]} >
                    {data.map((item, index) => (
                    <Cell key={`cell-${index}`} type="monotone" fill={item.cor} />
                ))}
                </Bar>
            </BarChart>
        ) : (
            null
        )}

        </ResponsiveContainer>
    );
}
export default Grafic;