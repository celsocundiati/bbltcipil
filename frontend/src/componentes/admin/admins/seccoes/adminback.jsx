
import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    grupo: "Bibliotecario"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("/api/admin/admins/", {
      withCredentials: true
    });
    setUsers(res.data);
  };

  const handleCreate = async () => {
    await axios.post("/api/admin/admins/", form, {
      withCredentials: true
    });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/admins/${id}/`, {
      withCredentials: true
    });
    fetchUsers();
  };

  const handleChangeRole = async (id, grupo) => {
    await axios.put(`/api/admin/admins/${id}/`, { grupo }, {
      withCredentials: true
    });
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Gestão de Usuários</h1>

      {/* Criar usuário */}
      <div className="mt-4 flex gap-2">
        <input placeholder="Username" onChange={e => setForm({...form, username: e.target.value})}/>
        <input placeholder="Password" onChange={e => setForm({...form, password: e.target.value})}/>
        
        <select onChange={e => setForm({...form, grupo: e.target.value})}>
          <option value="Admin">Admin</option>
          <option value="Bibliotecario">Bibliotecario</option>
        </select>

        <button onClick={handleCreate} className="bg-green-500 text-white px-3">
          Criar
        </button>
      </div>

      {/* Lista */}
      {users.map(user => (
        <div key={user.id} className="flex justify-between border p-3 mt-2">
          <span>{user.username}</span>

          <select
            onChange={(e) => handleChangeRole(user.id, e.target.value)}
            defaultValue={user.grupos[0]}
          >
            <option value="Admin">Admin</option>
            <option value="Bibliotecario">Bibliotecario</option>
          </select>

          <button
            onClick={() => handleDelete(user.id)}
            className="text-red-500"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}