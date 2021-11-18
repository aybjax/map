import { Card } from "primereact/card";
import "./statics/Login.css";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { fetchApi } from "../utils/fetch";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../utils/user";
import { useEffect } from "react";

interface FieldType {
  username: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();

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
      let response;
      try {
        response = await fetchApi("/login", {
          method: "post",
          body: JSON.stringify(data),
        });
      } catch (e) {
        return;
      }

      if (response.ok) {
        const body = await response.json();
        const token = body.token;

        const user = User.getInstance();
        user.token = token;

        navigate("/");
        formik.resetForm();
        return;
      }

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
            <InputText
              id="password"
              className={
                (classNames({ "p-invalid": isFormFieldValid("password") }),
                "width100")
              }
              value={formik.values.password}
              onChange={formik.handleChange}
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
          <Button label="Войти" />
          <Link to={{ pathname: "/register" }} className="mt-6">
            Регистрироваться
          </Link>
        </form>
      </Card>
    </div>
  );
}
