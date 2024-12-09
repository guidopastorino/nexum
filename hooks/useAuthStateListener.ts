'use client'

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/user/userSlice";
import { UserState } from "@/types/types";
import ky from "ky";

const useAuthStateListener = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        const userData = await ky.get(`/api/users/${userId}`).json<UserState>();

        dispatch(
          setUser({
            _id: userData._id,
            fullname: userData.fullname,
            username: userData.username,
            isVerified: userData.isVerified,
            email: userData.email,
            profileImage: userData.profileImage,
            bannerImage: userData.bannerImage,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
          })
        );
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        // Manejo de errores aquí (mostrar una alerta, por ejemplo)
      }
    };

    if (status === "authenticated" && session?.user?.id) {
      // Llamar a la función de fetch si el usuario está autenticado
      fetchUserData(session.user.id);
    } else if (status === "unauthenticated") {
      // Limpiar el estado si el usuario no está autenticado
      dispatch(clearUser());
    }
  }, [status, session, dispatch]);
};

export default useAuthStateListener;