"use client"

import React, { FormEvent, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from './Modal';
import { signIn } from 'next-auth/react';
import Loader from '../Loader';
import useShowMessage from '@/hooks/useShowMessage';
import { createUser } from '@/utils/fetchFunctions';
import Message from '../Message';
import ShowPasswordInput from '../ShowPasswordInput';
import ky from 'ky';

type AuthModalProps = {
  buttonTrigger: React.ReactElement<any, any>;
};

const AuthModal = ({ buttonTrigger }: AuthModalProps) => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Modal buttonTrigger={buttonTrigger}>
      <div className="bg-white dark:bg-neutral-800 px-3 py-5">
        {showRegister ? (
          <RegisterForm setShowRegister={setShowRegister} />
        ) : (
          <LoginForm setShowRegister={setShowRegister} />
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;


// 

const loginValidationSchema = Yup.object({
  usernameOrEmail: Yup.string().required('El usuario o email es obligatorio'),
  password: Yup.string().required('La contraseña es obligatoria'),
});

type LoginFormProps = {
  setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginForm = ({ setShowRegister }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { message, showMessage, visible } = useShowMessage();

  const handleSubmit = async (values: { usernameOrEmail: string; password: string }) => {
    try {
      setIsLoading(true);

      const result = await signIn('credentials', {
        redirect: false,
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      });

      if (result?.error) {
        showMessage(result.error);
      } else if (result?.url) {
        showMessage("Iniciando sesión...");

        const url = new URL(result.url);
        const callbackUrl = url.searchParams.get("callbackUrl");

        window.location.href = callbackUrl || result.url;
      }
      setIsLoading(false);
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Unexpected error");
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className="font-bold text-center text-2xl mb-4">Iniciar sesión</p>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Usuario o Email
              </label>
              <Field
                name="usernameOrEmail"
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${errors.usernameOrEmail && touched.usernameOrEmail ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Usuario o Email"
              />
              <ErrorMessage name="usernameOrEmail" component="p" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña
              </label>
              <ShowPasswordInput>
                {(showPassword) => (
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Tu contraseña"
                  />
                )}
              </ShowPasswordInput>
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
            </div>
            <button disabled={isLoading} type="submit" className="flex justify-center items-center w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
              {!isLoading ? "Iniciar sesión" : <Loader width={24} height={24} borderWidth={3} color='#fff' />}
            </button>
          </Form>
        )}
      </Formik>
      <button
        onClick={() => setShowRegister(true)}
        className="w-full mt-4 text-center text-blue-600 hover:underline"
      >
        Crear cuenta
      </button>

      <Message visible={visible} message={message} />
    </>
  )
}

// register multi-step form
type RegisterFormProps = {
  setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

const registerValidationSchema = [
  Yup.object({
    fullname: Yup.string().required("El nombre completo es obligatorio"),
    username: Yup.string().required("El usuario es obligatorio"),
    email: Yup.string().email("Email no válido").required("El email es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
  }),
  Yup.object({
    verificationPin: Yup.string().required("El código de verificación es obligatorio"),
  }),
  Yup.object({}), // Sin validación para imágenes
];



// This is a multi-step form
const RegisterForm = ({ setShowRegister }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false) // Form submittion
  const [currentStep, setCurrentStep] = useState<number>(0) // 0, ..., 3 (where 3 is the final step (user registration))
  const steps: string[] = ["Information about you", "Email verification", "The final details...", "Review"];

  const { message, showMessage, visible } = useShowMessage()

  const [formData, setFormData] = useState<{
    fullname: string;
    username: string;
    email: string;
    password: string;
    verificationPin: string;
    profileImage: File | null;
    bannerImage: File | null;
  }>({
    fullname: "",
    username: "",
    email: "",
    password: "",
    verificationPin: "",
    profileImage: null,
    bannerImage: null,
  });

  const [emailVerified, setEmailVerified] = useState<boolean>(false)

  const handleNext = (values: any) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    fieldName: string
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFieldValue(fieldName, file);
  };

  const sendEmailVerificationPin = async () => {
    try {
      const res = await ky.post("/api/send-pin", { json: { email: formData.email } }).json()
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const verifyEmail = async () => {
    try {
      const res = await ky.post("/api/verify-pin", { json: { email: formData.email, pin: formData.verificationPin } }).json()
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentStep === 1) {
      sendEmailVerificationPin()
    }
  }, [currentStep])

  // Final step data submittion
  const handleSubmit = async (values: any) => {
    // const finalData = { ...formData, ...values };
    // setIsLoading(true);
    // try {
    //   const res = await createUser({ userData: finalData });
    //   showMessage(res);
    // } catch (error) {
    //   showMessage(error instanceof Error ? error.message : 'Error desconocido al registrar el usuario');
    // }
    // setIsLoading(false);
    console.log(formData)
  };


  return (
    <>
      <p className="font-bold text-center text-2xl mb-4">{steps[currentStep]}</p>
      <Formik
        initialValues={formData}
        validationSchema={registerValidationSchema[currentStep]}
        onSubmit={(currentStep === steps.length - 1) ? handleSubmit : handleNext}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="space-y-4">
            {/* Paso 1: Información general */}
            {currentStep === 0 && (
              <>
                <FieldInput name="fullname" label="Nombre completo" errors={errors} touched={touched} />
                <FieldInput name="username" label="Usuario" errors={errors} touched={touched} />
                <FieldInput name="email" label="Email" type="email" errors={errors} touched={touched} />
                <FieldInput name="password" label="Contraseña" type="password" errors={errors} touched={touched} />
              </>
            )}
            {/* Paso 2: Verificación de email */}
            {currentStep === 1 && (
              <>
                {/* <FieldInput
                  disabled={emailVerified}
                  name="verificationPin"
                  label="Código de verificación"
                  errors={errors}
                  touched={touched}
                /> */}

                <Field
                  name={"verificationPin"}
                  type={"number"}
                  disabled={emailVerified}
                  value={formData.verificationPin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue("verificationPin", e.target.value);
                  }}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.verificationPin && touched.verificationPin ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500`}
                />
                <ErrorMessage name={"verificationPin"} component="p" className="text-red-500 text-sm" />

                <button type='button' onClick={() => verifyEmail()}>Verify email</button>
              </>
            )}
            {/* Paso 3: Subida de archivos (banner y pfp) */}
            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagen de perfil</label>
                  <input
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFieldValue, "profileImage")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagen de banner</label>
                  <input
                    name="bannerImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFieldValue, "bannerImage")}
                  />
                </div>
              </>
            )}
            {/* Paso 4: Revisión de datos y registro */}
            {currentStep === 3 && (
              <>
                review of data
              </>
            )}

            {/* buttons */}
            <div className="flex justify-between mt-4">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
                >
                  Atrás
                </button>
              )}
              <button
                type="submit"
                className={`py-2 px-4 ${currentStep === steps.length - 1 ? "bg-green-600" : "bg-blue-600"
                  } text-white rounded-md hover:bg-green-700 focus:outline-none`}
              >
                {currentStep === steps.length - 1 ? "Registrar" : "Siguiente"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {/* change to sign in */}
      <button
        onClick={() => setShowRegister(false)}
        className="w-full mt-4 text-center text-blue-600 hover:underline"
      >
        Iniciar sesión
      </button>
      <Message visible={visible} message={message} />
    </>
  )
}

const FieldInput = ({ disabled = false, name, label, type = "text", errors, touched }: any) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <Field
      name={name}
      type={type}
      disabled={disabled}
      className={`mt-1 block w-full px-3 py-2 border ${errors[name] && touched[name] ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500`}
    />
    <ErrorMessage name={name} component="p" className="text-red-500 text-sm" />
  </div>
);