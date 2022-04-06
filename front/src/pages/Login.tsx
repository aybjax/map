import { Card } from "primereact/card";
import "./statics/Login.css";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
//@ts-ignore
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { fetchApi } from "../utils/fetch";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../utils/user";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Password } from "primereact/password";

interface FieldType {
  username: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const user = User.getInstance();

    if (user.isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    } as FieldType,
    validate: (data) => {
      let errors: Partial<FieldType> = {};

      if (!data.username) {
        errors.username = "Заполните имя пользователя.";
      }

      if (!data.password) {
        errors.password = "Заполните пароль.";
      }

      return errors;
    },
    onSubmit: async (data: FieldType) => {
      setLoader(true);
      let response;
      try {
        response = await fetchApi("/login", {
          method: "post",
          body: JSON.stringify(data),
        });
      } catch (e) {
        setLoader(false);
        return;
      }

      if (response.ok) {
        const body = await response.json();
        const token = body.token;
        const is_admin = body.is_admin;
        const username = body.username;

        const user = User.getInstance();
        user.userinfo = {
          token,
          is_admin,
          username,
          year: user.year,
        };

        if (toast.current) {
          //@ts-ignore
          toast.current.show({
            severity: "success",
            summary: "Пользователь найден",
            life: 3000,
          });
        }

        setTimeout(() => {
          navigate("/");
        }, 1000);

        formik.resetForm();
        return;
      } else {
        const body = await response.json();
        if (body.error) {
          setError(body.error);
        }
      }

      setLoader(false);

      const errors: Partial<FieldType> = await response.json();

      formik.setErrors(errors);
    },
  });

  const isFormFieldValid = (field: keyof FieldType) =>
    !!(formik.touched[field] && formik.errors[field]);
  const getFormErrorMessage = (field: keyof FieldType) => {
    return (
      isFormFieldValid(field) && (
        <small className="p-error">{formik.errors[field]}</small>
      )
    );
  };

  return (
    <div className="flex justify-center mt-16 mb-16">
      <Card
        title="Войти"
        className="login--card"
        style={{ textAlign: "center" }}
      >
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col items-stretch"
        >
          {error && (
            <div className="flex justify-center text-red-700 mb-3 -mt-3">
              {error}
            </div>
          )}
          <div className="p-float-label mb-6">
            <InputText
              id="username"
              className={
                (classNames({ "p-invalid": isFormFieldValid("username") }),
                "width100")
              }
              value={formik.values.username}
              onChange={formik.handleChange}
            />
            <label
              htmlFor="username"
              className={classNames({
                "p-error": isFormFieldValid("username"),
              })}
            >
              Имя пользователя*
            </label>
            {getFormErrorMessage("username")}
          </div>
          <div className="p-float-label mb-6">
            <Password
              id="password"
              name="password"
              className={
                (classNames({ "p-invalid": isFormFieldValid("password") }),
                "width100")
              }
              value={formik.values.password}
              onChange={formik.handleChange}
              toggleMask
              feedback={false}
            />
            <label
              htmlFor="password"
              className={classNames({
                "p-error": isFormFieldValid("password"),
              })}
            >
              Пароль*
            </label>
            {getFormErrorMessage("password")}
          </div>
          <Button label="Войти" loading={loader} />
          <Link to={{ pathname: "/register" }} className="mt-6">
            Регистрироваться
          </Link>
        </form>
      </Card>
      <Toast ref={toast} />
    </div>
  );
}
