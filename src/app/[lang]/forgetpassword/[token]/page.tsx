"use client";

import Button from "@/components/Button";
import FormTextInput from "@/components/FormTextInput";
import { useTranslation } from "@/context/Translation";
import { passwordValidation } from "@/lib/formatValidation";
import { FieldError } from "@/types";
import React, { ChangeEvent, useState } from "react";

// type Props = {
//   params: { token: string };
// };

export default function Page() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState<{ password: FieldError; confirm: FieldError }>({
    password: false,
    confirm: false
  });

  const fieldChangeHandle = (value: string, name: string) => {
    setError({ ...error, [name]: false });
    setForm({ ...form, [name]: value });
  };

  const passwordOnBlurValidation = (e: ChangeEvent<HTMLInputElement>) => {
    let errors = { ...error };
    if (e.target.value && !passwordValidation(e.target.value))
      errors = {
        ...errors,
        password:
          "Password length must be 8 and contains atleast a number, an english character, a special character (!,*,?,&,%)"
      };

    if (form.confirm && e.target.value !== form.confirm) errors = { ...error, confirm: t("auth.passwordsNotMatch") };

    setError({ ...errors });
  };

  const validate = () => {
    let isError = false;
    let errors = { ...error };

    let key: keyof typeof errors;

    for (key in errors) {
      if (errors[key]) {
        isError = true;
        break;
      }
    }

    return isError;
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const isError = validate();
    if (isError) return;
  };

  return (
    <form onSubmit={submit}>
      <h1 className="mb-4 text-center text-2xl font-bold">Reset Your Password</h1>
      <FormTextInput
        error={error.password}
        label={t("auth.password")}
        name="password"
        placeholder={t("auth.password")}
        required
        type="password"
        value={form.password}
        onBlur={passwordOnBlurValidation}
        onChange={(e) => fieldChangeHandle(e.target.value, e.target.name)}
      />
      <FormTextInput
        error={error.confirm}
        label={t("auth.confirmPassword")}
        name="confirmPassword"
        placeholder={t("auth.confirmPassword")}
        required
        type="password"
        value={form.confirm}
        onChange={(e) => fieldChangeHandle(e.target.value, e.target.name)}
        onBlur={(e) => {
          if (e.target.value !== form.password) setError({ ...error, confirm: t("auth.passwordsNotMatch") });
        }}
      />
      <Button className="bg-primary text-white">{t("auth.confirm")}</Button>
    </form>
  );
}
