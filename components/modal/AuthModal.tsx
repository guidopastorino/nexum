"use client"

import React, { FormEvent, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from './Modal';
import { signIn } from 'next-auth/react';
import Loader from '../Loader';
import useShowMessage from '@/hooks/useShowMessage';

type AuthModalProps = {
  buttonTrigger: React.ReactElement<any, any>;
};

const AuthModal = ({ buttonTrigger }: AuthModalProps) => {
  const [showRegister, setShowRegister] = useState(false);

  // Esquemas de validación para login y registro
  const loginValidationSchema = Yup.object({
    usernameOrEmail: Yup.string().required('El usuario o email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria'),
  });

  const registerValidationSchema = Yup.object({
    username: Yup.string().required('El usuario es obligatorio'),
    email: Yup.string().email('Email no válido').required('El email es obligatorio'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
  });

  return (
    <Modal buttonTrigger={buttonTrigger}>
      <div className="bg-white dark:bg-neutral-800 px-3 py-5">
        {showRegister ? (
          <RegisterForm setShowRegister={setShowRegister} validationSchema={registerValidationSchema} />
        ) : (
          <LoginForm setShowRegister={setShowRegister} validationSchema={loginValidationSchema} />
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;

type LoginFormProps = {
  setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
  validationSchema: Yup.ObjectSchema<any>;
};

const LoginForm = ({ setShowRegister, validationSchema }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { message, showMessage, visible } = useShowMessage();

  const handleSubmit = async (values: { usernameOrEmail: string; password: string }) => {
    try {
      setIsLoading(true)

      const result = await signIn('credentials', {
        redirect: false,
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
        callbackUrl: "/",
      });

      if (result?.error) {
        showMessage(result.error);
      } else if (result?.url) {
        showMessage("Iniciando sesión...")
        if (typeof window !== "undefined") window.location.href = result.url;
      }
      setIsLoading(false)
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Unexpected error");
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className="font-bold text-center text-2xl mb-4">Iniciar sesión</p>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        validationSchema={validationSchema}
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
              <Field
                name="password"
                type="password"
                className={`mt-1 block w-full px-3 py-2 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Tu contraseña"
              />
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
            </div>
            <button disabled={isLoading} type="submit" className="flex justify-center items-center w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
              {!isLoading ? "Iniciar sesión" : <Loader width={24} height={24} borderWidth={3} />}
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

      {visible && <div className='p-2 text-center text-red-500'>{message}</div>}
    </>
  )
}

type RegisterFormProps = {
  setShowRegister: React.Dispatch<React.SetStateAction<boolean>>;
  validationSchema: Yup.ObjectSchema<any>;
};

const RegisterForm = ({ setShowRegister, validationSchema }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (values: { username: string; email: string; password: string }) => {
    setIsLoading(true)
  }

  return (
    <>
      <p className="font-bold text-center text-2xl mb-4">Crear cuenta</p>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
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
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Field
                name="email"
                type="email"
                className={`mt-1 block w-full px-3 py-2 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Tu correo electrónico"
              />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña
              </label>
              <Field
                name="password"
                type="password"
                className={`mt-1 block w-full px-3 py-2 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Tu contraseña"
              />
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
            </div>
            <button disabled={isLoading} type="submit" className="flex justify-center items-center w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none">
              {!isLoading ? "Registrarse" : <Loader width={24} height={24} borderWidth={3} />}
            </button>
          </Form>
        )}
      </Formik>
      <button
        onClick={() => setShowRegister(false)}
        className="w-full mt-4 text-center text-blue-600 hover:underline"
      >
        Iniciar sesión
      </button>
    </>
  )
}