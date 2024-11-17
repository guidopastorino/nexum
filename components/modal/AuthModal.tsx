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
    verificationCode: Yup.string().required("El código de verificación es obligatorio"),
  }),
  Yup.object({}), // Sin validación para imágenes
];

type RegisterFormProps = {
  setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
};

// This is a multi-step form
const RegisterForm = ({ setShowRegister }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false) // Form submittion
  const [currentStep, setCurrentStep] = useState<number>(0) // 0, ..., 3 (where 3 is the final step (user registration))

  useEffect(() => console.log(currentStep), [currentStep])

  const steps: string[] = ["Information about you", "Email verification", "The final details...", "Review"];

  const [formData, setFormData] = useState<{
    fullname: string;
    username: string;
    email: string;
    password: string;
    verificationCode: string;
    profileImage: File | null;
    bannerImage: File | null;
  }>({
    fullname: "",
    username: "",
    email: "",
    password: "",
    verificationCode: "",
    profileImage: null,
    bannerImage: null,
  });

  useEffect(() => console.log(formData), [formData])

  const handleNext = async (values: any) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const isLastStep = currentStep === steps.length - 1;

  const { message, showMessage, visible } = useShowMessage()

  // Final step data submittion
  const handleSubmit = async (values: any) => {
    const finalData = { ...formData, ...values };
    setIsLoading(true);
    try {
      const res = await createUser({ userData: finalData });
      showMessage(res);
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'Error desconocido al registrar el usuario');
    }
    setIsLoading(false);
  };


  return (
    <>
      <p className="font-bold text-center text-2xl mb-4">{steps[currentStep]}</p>
      <Formik
        initialValues={formData}
        validationSchema={registerValidationSchema[currentStep]}
        onSubmit={isLastStep ? handleSubmit : handleNext}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            {currentStep === 0 && (
              <>
                {/* Paso 1: Información del usuario */}
                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre completo
                  </label>
                  <Field
                    name="fullname"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.fullname && touched.fullname ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Tu nombre completo"
                  />
                  <ErrorMessage name="fullname" component="p" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Usuario
                  </label>
                  <Field
                    name="username"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.username && touched.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Tu usuario"
                  />
                  <ErrorMessage name="username" component="p" className="text-red-500 text-sm" />
                </div>
              </>
            )}
            {currentStep === 1 && (
              <>
                {/* Paso 2: Código de verificación */}
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Código de verificación
                  </label>
                  <Field
                    name="verificationCode"
                    type="text"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.verificationCode && touched.verificationCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Código enviado a tu correo"
                  />
                  <ErrorMessage name="verificationCode" component="p" className="text-red-500 text-sm" />
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                {/* Paso 3: Detalles finales */}
                <Field
                  name="profileImage"
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files && e.target.files[0]; // Verifica que files no sea null
                    setFormData((prev) => ({
                      ...prev,
                      profileImage: file || null,
                    }));
                  }}
                />
                <div>
                  <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Imagen de banner
                  </label>
                  <input
                    name="bannerImage"
                    type="file"
                    className="mt-1 block w-full px-3 py-2 text-gray-700 dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-100"
                    accept="image/*"
                  />
                </div>
              </>
            )}
            {/* buttons */}
            {currentStep === 3
                ? <>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                  >
                    Registrarse
                  </button>
                </>
                : <>
                  <button
                    onClick={handleNext}
                    className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                  >
                    Siguiente
                  </button>
            </>}
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
            </div>
          </Form>
        )}
      </Formik>

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