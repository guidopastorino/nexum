"use client"

import React, { FormEvent, useEffect, useRef, useState } from 'react';
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
import PostSkeleton from '../PostSkeleton';
//
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { uploadFiles } from '@/actions/uploadFiles';

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

type FormDataState = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  verificationPin: string;
  profileImage: string | null;
  bannerImage: string | null;
};

// This is a multi-step form
const RegisterForm = ({ setShowRegister }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false) // Form submittion
  const [currentStep, setCurrentStep] = useState<number>(0) // 0, ..., 2 (where 2 is the final step (user registration))
  const steps: string[] = ["Information about you", "Email verification", "Review"];

  const [emailVerified, setEmailVerified] = useState<boolean>(false)

  const { message, showMessage, visible } = useShowMessage()

  const ProfileImageRef = useRef<HTMLInputElement | null>(null)
  const BannerImageRef = useRef<HTMLInputElement | null>(null)

  const [formData, setFormData] = useState<FormDataState>({
    fullname: "",
    username: "",
    email: "",
    password: "",
    verificationPin: "",
    profileImage: null,
    bannerImage: null,
  });

  useEffect(() => console.log(formData), [formData])
  useEffect(() => console.log(currentStep), [currentStep])

  const handleNext = (values: any) => {
    setFormData((prev) => ({ ...prev, ...values })); // Combina todos los valores
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
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
      setEmailVerified(true)
      showMessage("Email verified")
    } catch (error) {
      console.log(error)
      showMessage("Error trying to verify email")
    }
  }

  // enviar email en el paso 2
  useEffect(() => {
    if (currentStep === 1 && !emailVerified) {
      sendEmailVerificationPin()
    }
  }, [currentStep])

  const censorEmail = (email: string) => {
    const [local, domain] = email.split("@");
    const censoredLocal = local[0] + "****"; // Solo muestra la primera letra del local.
    const censoredDomain = domain.split(".")[0][0] + "****"; // Muestra la primera letra del dominio y oculta el resto.

    return `${censoredLocal}@${censoredDomain}`;
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'profileImage' | 'bannerImage',
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!event.target.files?.length) return;
  
    const file = event.target.files[0];
    const previewUrl = URL.createObjectURL(file);
  
    setFormData((prev) => ({ ...prev, [type]: previewUrl })); // URL de previsualización
    setFieldValue(type, file); // Guardar el archivo en el formData
  };

  // Final step data submittion (user registration)
  const handleSubmit = async (values: any) => {
    const { verificationPin, profileImage, bannerImage, ...finalData } = { ...formData, ...values };
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      if (profileImage instanceof File) formData.append("files", profileImage);
      if (bannerImage instanceof File) formData.append("files", bannerImage);
  
      const uploadResponse = await uploadFiles(formData);
  
      // Actualizar las URLs en el formulario
      const profileImageUrl = uploadResponse[0]?.data?.url ?? null;
      const bannerImageUrl = uploadResponse[1]?.data?.url ?? null;
  
      const finalUserData = {
        ...finalData,
        profileImage: profileImageUrl,
        bannerImage: bannerImageUrl,
      };
  
      const res = await createUser({ userData: finalUserData });
      showMessage(res);
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Error desconocido al registrar el usuario");
    }
  
    setIsLoading(false);
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
                {formData.email && !emailVerified && (
                  <p>
                    A verification email has been sent to {censorEmail(formData.email)}.
                  </p>
                )}

                <input
                  type="text"
                  disabled={emailVerified}
                  name="verificationPin"
                  value={formData.verificationPin}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, verificationPin: e.target.value }));
                    setFieldValue("verificationPin", e.target.value);
                  }}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.verificationPin ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500`}
                />

                {emailVerified && <div className='p-2 text-white bg-green-700 rounded-md'>Email verified successfully</div>}

                <ErrorMessage name="verificationPin" component="p" className="text-red-500 text-sm" />

                {!emailVerified && <div className='itemHover itemClass text-center' onClick={verifyEmail}>Verify email</div>}
              </>
            )}
            {/* Paso 3: Subida de archivos (banner y pfp) */}
            {/* Paso 4: Revisión de datos y registro */}
            {currentStep === 2 && (
              <>
                {/* Hidden inputs */}
                <input
                  ref={BannerImageRef}
                  type="file"
                  hidden
                  onChange={(e) => handleImageChange(e, 'bannerImage', setFieldValue)}
                />
                <input
                  ref={ProfileImageRef}
                  type="file"
                  hidden
                  onChange={(e) => handleImageChange(e, 'profileImage', setFieldValue)}
                />

                <div className="w-full">
                  {/* header */}
                  <div className="relative w-full pb-[30%] left-0">
                    {/* banner image */}
                    <img
                      onClick={() => BannerImageRef?.current?.click()}
                      src={formData?.bannerImage ? formData?.bannerImage : "https://www.solidbackgrounds.com/images/1584x396/1584x396-light-sky-blue-solid-color-background.jpg"}
                      className="cursor-pointer absolute top-0 w-full object-cover h-full rounded-b-lg hover:brightness-90 duration-100"
                    />
                    <div className='z-50 absolute flex justify-start items-end left-3 top-[85%] gap-2'>
                      <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                        {/* profile image */}
                        <img
                          onClick={() => ProfileImageRef?.current?.click()}
                          src={formData?.profileImage ? formData?.profileImage : "/default_pfp.jpg"}
                          className="w-full h-full object-cover cursor-pointer hover:brightness-90 duration-100"
                        />
                      </div>
                      <div className='dark:text-white text-black flex flex-col justify-center items-start'>
                        <span className='font-bold text-lg'>{formData.fullname}</span>
                        <span className='opacity-70'>@{formData.username}</span>
                      </div>
                    </div>
                  </div>
                  <div className='mt-20'>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <PostSkeleton />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* buttons */}
            <div className="sticky bottom-0 z-50 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-3">
              <div className='flex justify-between'>
                {currentStep == 0 && <div></div>}
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
                  disabled={isLoading || (currentStep === 1 && !emailVerified)}
                  type="submit"
                  className={`${isLoading || (currentStep === 1 && !emailVerified) ? "opacity-60 pointer-events-none" : "opacity-100"} flex justify-center items-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none`}
                >
                  {isLoading && "Registrando..."}
                  {!isLoading && currentStep === steps.length - 1 ? "Registrar" : "Siguiente"}
                </button>
              </div>

              <Message visible={visible} message={message} />
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