"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    course: "",
    phone: "",
    semester: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setLoading(true);

    // Validações básicas
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não correspondem");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      await api.post("/users", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        course: formData.course,
        phone: formData.phone,
        semester: formData.semester,
      });

      setSuccess(
        "Usuário cadastrado com sucesso! Redirecionando para login...",
      );
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Cadastro
          </h2>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm font-medium text-red-800">{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm font-medium text-green-800">{success}</div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                placeholder="Seu nome completo"
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
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Telefone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Seu telefone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="course"
                className="block text-sm font-medium text-gray-700"
              >
                Curso
              </label>
              <input
                id="course"
                name="course"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nome do curso"
                value={formData.course}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="semester"
                className="block text-sm font-medium text-gray-700"
              >
                Semestre
              </label>
              <input
                id="semester"
                name="semester"
                type="number"
                min="1"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ex: 2023.1"
                value={formData.semester}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-blue-600 hover:text-blue-700">
              Já tem conta? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
