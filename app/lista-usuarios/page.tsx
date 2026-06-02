"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

interface Usuario {
  id: string;
  name: string;
  email: string;
}

export default function ListaUsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setUsuarios(response.data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        setDeletingId(id);
        await api.delete(`/users/${id}`);
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao deletar usuário");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Lista de Usuários
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-sm font-medium text-red-800">{error}</div>
          </div>
        )}

        {/* Botão de novo usuário */}
        <div className="mb-6">
          <Link
            href="/cadastro"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            + Novo Usuário
          </Link>
        </div>

        {/* Tabela */}
        {usuarios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum usuário encontrado</p>
            <Link
              href="/cadastro"
              className="text-blue-600 hover:text-blue-700"
            >
              Criar primeiro usuário
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {usuario.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Link
                        href={`/editar-usuario/${usuario.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(usuario.id)}
                        disabled={deletingId === usuario.id}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                      >
                        {deletingId === usuario.id ? "Deletando..." : "Remover"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
