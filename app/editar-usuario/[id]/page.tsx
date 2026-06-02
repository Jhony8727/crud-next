"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

interface Usuario {
  id: string;
  name: string;
  email: string;
}

export default function EditarUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<Usuario>({
    id: "",
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    carregarUsuario();
  }, [id]);

  const carregarUsuario = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${id}`);
      setFormData(response.data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao carregar usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await api.put(`/users/${id}`, {
        name: formData.name,
        email: formData.email,
      });

      setSuccess("Usuário atualizado com sucesso!");
      setTimeout(() => {
        router.push("/lista-usuarios");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao atualizar usuário");
    } finally {
      setSaving(false);
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/lista-usuarios"
              className="text-blue-600 hover:text-blue-700"
            >
              ← Voltar
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Editar Usuário</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-sm font-medium text-red-800">{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4 mb-6">
            <div className="text-sm font-medium text-green-800">{success}</div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>

              <Link
                href="/lista-usuarios"
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
