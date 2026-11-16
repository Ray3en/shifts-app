"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@mono/shared";
import { login } from "../api/login-api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    try {
      await login(values);
      router.replace("/shifts");
      router.refresh();
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error) ? error.response?.data.message : null;
      setServerError(message ?? "Не удалось войти");
    }
  });

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <section className="w-full max-w-105 rounded-2xl bg-white p-8 shadow-[0_16px_48px_rgba(24,28,40,0.08)]">
        <p className="text-sm font-semibold text-[#5d7bea]">CRM</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight">Вход</h1>
        <p className="mt-2 text-sm text-[#777982]">Войдите, чтобы открыть график смен.</p>

        <form className="mt-7 space-y-5" onSubmit={onSubmit} noValidate>
          <label className="block text-sm font-medium">
            Логин
            <input
              className="mt-2 h-11 w-full rounded-lg border border-[#dfe1e7] bg-[#f8f8fa] px-3 outline-none focus:border-[#5d7bea] focus:ring-2 focus:ring-[#dbe3ff]"
              autoComplete="username"
              {...register("login")}
            />
            {errors.login ? <span className="mt-1 block text-xs text-red-600">{errors.login.message}</span> : null}
          </label>

          <label className="block text-sm font-medium">
            Пароль
            <input
              className="mt-2 h-11 w-full rounded-lg border border-[#dfe1e7] bg-[#f8f8fa] px-3 outline-none focus:border-[#5d7bea] focus:ring-2 focus:ring-[#dbe3ff]"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password ? <span className="mt-1 block text-xs text-red-600">{errors.password.message}</span> : null}
          </label>

          {serverError ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p> : null}

          <button
            className="h-11 w-full rounded-lg bg-[#5d7bea] text-sm font-medium text-white hover:bg-[#2954e8] disabled:cursor-wait disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Входим…" : "Войти"}
          </button>
        </form>
      </section>
    </main>
  );
}
