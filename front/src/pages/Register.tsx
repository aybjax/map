import { Card } from "primereact/card";
import "./statics/Login.css";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { fetchApi } from "../utils/fetch";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { User } from "../utils/user";
import { Toast } from "primereact/toast";
import { Password } from "primereact/password";

interface FieldType {
  username: string;
  password: string;
  password2: string;
}

export function Register() {
  const navigate = useNavigate();
  const toast = useRef(null);
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
      password2: "",
    } as FieldType,
    validate: (data) => {
      let errors: Partial<FieldType> = {};

      if (!data.username) {
        errors.username = "Заполните имя пользователя.";
      }

      if (!data.password) {
        errors.password = "Заполните пароль.";
      }

      if (!data.password2) {
        errors.password2 = "Заполните пароль.";
      }

      if (!(errors.password && errors.password2)) {
        if (data.password !== data.password2) {
          errors.password = "Пароли должны совпадать";
          errors.password2 = "Пароли должны совпадать";
        }
      }

      return errors;
    },
    onSubmit: async (data: FieldType) => {
      setLoader(true);
      let response;
      try {
        response = await fetchApi("/register", {
          method: "post",
          body: JSON.stringify(data),
        });
      } catch (e) {
        setLoader(false);
        return;
      }

      if (response.ok) {
        if (toast.current) {
          //@ts-ignore
          toast.current.show({
            severity: "success",
            summary: "Регистрация успешна",
            life: 3000,
          });
        }

        setTimeout(() => {
          navigate("/login");
        }, 1000);
        formik.resetForm();

        return;
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
        title="Регистрироваться"
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

          <div className="p-float-label mb-6">
            <Password
              id="password2"
              name="password2"
              className={
                (classNames({ "p-invalid": isFormFieldValid("password2") }),
                "width100")
              }
              value={formik.values.password2}
              onChange={formik.handleChange}
              toggleMask
              feedback={false}
            />
            <label
              htmlFor="password2"
              className={classNames({
                "p-error": isFormFieldValid("password2"),
              })}
            >
              Повторный пароль*
            </label>
            {getFormErrorMessage("password2")}
          </div>
          <Button label="Регистрироваться" loading={loader} />
          <Link to={{ pathname: "/login" }} className="mt-6">
            Войти
          </Link>
        </form>
      </Card>
      <Toast ref={toast} />
    </div>
  );
}
