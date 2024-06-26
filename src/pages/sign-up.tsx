import { gql } from "@/__generated__";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import Error from "@/components/Error";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import LoginLayout from "@/container/login/LoginLayout";
import { RootState } from "@/stores/store";
import getTrans from "@/utils/getTrans";
import { useMutation } from "@apollo/client";
import { useLogin, useLogout } from "@faustwp/core";
import Link from "next/link";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function SignUp() {
  const { login, loading: loginLoading } = useLogin();
  const { isReady, isAuthenticated } = useSelector(
    (state: RootState) => state.viewer.authorizedUser
  );
  const { logout, loading: logoutLoading } = useLogout();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userName = email.split("@")[0];

  const T = getTrans();

  const [mutationRegisterUser, { loading, data, error, called }] = useMutation(
    gql(/* GraphQL */ `
      mutation SignUpPageMutationRegisterUser(
        $username: String! = ""
        $email: String
        $password: String
      ) {
        registerUser(
          input: { username: $username, email: $email, password: $password }
        ) {
          clientMutationId
        }
      }
    `),
    {
      onCompleted: (data) => {
        toast.success("User created successfully!");
        if (isAuthenticated) {
          logout("/login");
        } else {
          login(email, password, "/dashboard/edit-profile/general");
        }
      },
      onError: (error) => {
        toast.error(error.message, {
          position: "bottom-center",
        });
      },
    }
  );

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(T["Email and password are required!"], {
        position: "bottom-center",
      });
      return;
    }
    mutationRegisterUser({
      variables: {
        username: userName,
        email: email,
        password: password,
      },
    });
  };

  return (
    <LoginLayout
      isSignUpPage
      rightBtn={{
        text: T.Login,
        href: "/login",
      }}
    >
      <>
        <div className="grid gap-6">
          <form onSubmit={handleRegister}>
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="email">{T.Email}</Label>
                <Input
                  id="email"
                  placeholder={T["Enter your email"]}
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">{T.Password}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid">
                <ButtonPrimary
                  loading={loading || loginLoading || logoutLoading}
                >
                  {T["Sign up"]}
                </ButtonPrimary>

                {!!error?.message && (
                  <Error className="text-center mt-2" error={error.message} />
                )}
              </div>
            </div>
          </form>
        </div>

        <p className="text-center text-sm leading-6 text-gray-500 dark:text-neutral-400">
          {T["Already have an account?"]}{" "}
          <Link
            href="/login"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-500 hover:underline underline-offset-2"
          >
            {T.Login}!
          </Link>
        </p>
      </>
    </LoginLayout>
  );
}
