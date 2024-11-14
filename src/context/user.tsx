"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { parseCookies } from "@/lib/misc";
import { useGeneralStore } from "@/stores/generalStore";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/layout/MainLayout";
import { useTranslation } from "./Translation";
import { RegisterForm, User, FieldError } from "../types";
import axios from "@/lib/axios";
import { useUserStore } from "@/stores/userStore";
import { removeToken, setAccessToken } from "@/actions";

interface UserContextTypes {
  user: User | null;
  profile: undefined;
  register: {
    errorMessage: FieldError;
    mutate: (form: RegisterForm) => Promise<void>;
    isPending: boolean;
    clearError: () => void;
  };
  login: {
    errorMessage: FieldError;
    mutate: (email: string, password: string) => void;
    isPending: boolean;
    clearError: () => void;
  };
  logout: () => void;
}

const UserContext = createContext<UserContextTypes>({
  user: null,
  profile: undefined,
  login: { errorMessage: false, mutate: () => Promise.resolve(), isPending: false, clearError: () => {} },
  logout: () => Promise.resolve(),
  register: { errorMessage: false, mutate: () => Promise.resolve(), isPending: false, clearError: () => {} }
});

type ContextProps = { children: ReactNode; user: { user: User; token: string } };

function UserProvider({ children, user }: ContextProps) {
  const { setLikes, setSavedProducts, setFollowedVendors, setReviewedProducts, setCartProducts } = useUserStore();
  const { setIsLoginOpen, setCountries } = useGeneralStore();
  const [data, setData] = useState<User | null>(user.user ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<FieldError>(false);
  const { t } = useTranslation();

  useEffect(() => {
    axios.interceptors.request.use((config) => {
      const access_token = parseCookies(document.cookie)?.filter((cookie) => cookie.name === "access_token")[0]?.value;
      config.headers.Authorization = `Bearer ${access_token}`;
      return config;
    });

    axios.interceptors.response.use(
      (res) => res,
      (err: AxiosError) => {
        if (err.status === 500) toast.error(t("serverFail"));
        if (err.status === 403) {
          queryClient.clear();
          queryClient.fetchQuery({ queryKey: ["tokenCheck"] });
        }
        return Promise.reject(err);
      }
    );

    setAccessToken(user.token);
    setCountries();
    setIsLoading(false);
  }, []);

  const resetUserStore = () => {
    setLikes();
    setSavedProducts();
    setFollowedVendors();
    setReviewedProducts();
    setCartProducts();
  };

  useQuery({
    queryKey: ["tokenCheck"],
    queryFn: () =>
      axios
        .get<User>("/api/auth/check")
        .then((res) => {
          setData(res.data);
          resetUserStore();
          return res.data;
        })
        .catch((err: AxiosError) => {
          if (data?.isRegistered && err.response?.status === 400) {
            setData(null);
            toast.error(t("auth.forcedLogout"));
            freshTokenMutation.mutate();
          } else if (err.response?.status === 400) {
            setData(null);
            freshTokenMutation.mutate();
          }
          return null;
        }),

    refetchInterval: 120000
  });

  const freshTokenMutation = useMutation({
    mutationKey: ["guestToken"],
    mutationFn: () => axios.get<{ user: User; token: string }>("/api/auth/guest"),
    onSuccess: (res) => {
      setAccessToken(res.data.token);
      setData({ ...res.data.user });
      resetUserStore();
      setIsLoginOpen(false);
    }
  });

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (form: RegisterForm) =>
      axios
        .post<{ token: User }>("/api/auth/register", { ...form, gender: !form.gender.length ? null : form.gender })
        .then((res) => res.data.token),

    onSuccess: () => {
      toast.success(t("auth.successfullRegister"));
    },
    onError: (err: AxiosError<{ message: string }>) => {
      if (err.response?.status === 400) setErrorMessage(err.response?.data.message ?? "");
    }
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (form: { email: string; password: string }) =>
      axios.post<{ user: User; token: string }>("/api/auth/login", { ...form }).then((data) => data.data),

    onSuccess: (res) => {
      setAccessToken(res.token);
      toast.success(t("auth.successfullLogin"));
      setData({ ...res.user });
      resetUserStore();
      setIsLoginOpen(false);
    },

    onError: (err: AxiosError<{ message: string }>) => {
      if (err.response?.status === 401) setErrorMessage(err.response.data.message);
    }
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => axios.post("/api/auth/logout"),
    onSuccess: async () => {
      queryClient.clear();
      setData(null);
      await removeToken();
      toast.warn(t("auth.successfullLogout"));
      freshTokenMutation.mutate();
    }
  });

  const login = (email: string = "", password: string = "") => {
    loginMutation.mutate({ email, password });
  };

  const register = async (form: RegisterForm) => {
    await registerMutation.mutateAsync({ ...form });
  };

  const loginObject = {
    errorMessage,
    mutate: login,
    isPending: loginMutation.isPending,
    clearError: () => setErrorMessage(false)
  };
  const registerObject = {
    errorMessage,
    mutate: register,
    isPending: registerMutation.isPending,
    clearError: () => setErrorMessage(false)
  };

  return (
    <UserContext.Provider
      value={{
        user: data,
        profile: undefined,
        login: loginObject,
        logout: logoutMutation.mutate,
        register: registerObject
      }}
    >
      {!isLoading ? children : null}
    </UserContext.Provider>
  );
}

export default UserProvider;

export const useUser = () => useContext(UserContext);
