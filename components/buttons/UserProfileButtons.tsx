"use client";

import React, { useEffect, useRef, useState } from 'react';
import { HiPencil } from "react-icons/hi2";
import { BsThreeDots, BsTrash } from 'react-icons/bs';
import { IoSearchOutline } from 'react-icons/io5';
import { useSession } from 'next-auth/react';
import UnfollowUserButton from '@/components/buttons/post/UnfollowUserButton';
import FollowUserButton from '@/components/buttons/post/FollowUserButton';
import { useFollowUser } from '@/hooks/useFollowUser';
import useToast from '@/hooks/useToast';
import AuthModal from '@/components/modal/AuthModal';
import ResponsiveMenu from '../ResponsiveMenu';
import { OthersProfileMenu } from '../ProfileOptionsMenu';
import Modal from '../modal/Modal';
import useUser from '@/hooks/useUser';
import { FaCamera } from 'react-icons/fa6';
import { updateUser } from '@/utils/fetchFunctions';
import { uploadFiles } from '@/actions/uploadFiles';
import { UpdateUserData, UserState } from '@/types/types';
import { useQueryClient } from 'react-query';
import useAuthStateListener from '@/hooks/useAuthStateListener';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/user/userSlice';
import { utapi } from "@/server/uploadthing";
import { resizeImage } from '@/utils/resizeImage';
import useModal from '@/hooks/useModal';

type UserProfileButtonsProps = {
  disableIfSameUser?: boolean;
  isFromItem?: boolean;
  userId: string; // userId of the user's profile
  username: string;
  isFollowingUser: boolean;
  isFollowedByUser: boolean;
  postId?: string;
};

const UserProfileButtons: React.FC<UserProfileButtonsProps> = ({
  disableIfSameUser = false,
  isFromItem = false,
  userId,
  username,
  isFollowingUser,
  isFollowedByUser,
  postId
}) => {
  const { handleOpenModal, handleCloseModal } = useModal('globalModal');

  const { data: session } = useSession();
  const user = useUser()

  const dispatch = useDispatch(); // para actualizar el estado del usuario actual

  const queryClient = useQueryClient()

  const ProfileImageInputRef = useRef<HTMLInputElement | null>(null)
  const BannerImageInputRef = useRef<HTMLInputElement | null>(null)

  const [loading, setIsLoading] = useState<boolean>(false)
  const [userUpdatedData, setUserUpdatedData] = useState({
    fullname: '',
    description: '',
    profileImage: null as File | null,
    bannerImage: null as File | null,
  })
  const [isEditing, setIsEditing] = useState<boolean>(false)

  useEffect(() => {
    console.log(userUpdatedData)
    setIsEditing(!!userUpdatedData.fullname || !!userUpdatedData.description || !!userUpdatedData.profileImage || !!userUpdatedData.bannerImage)
  }, [userUpdatedData])

  const [initialFollowState, setInitialFollowState] = useState<boolean>(isFollowingUser || false)

  const [isFollowing, setIsFollowing] = useState(isFollowingUser);
  const mutation = useFollowUser(userId, isFollowing, postId);
  const { showToast } = useToast();

  const handleFollowToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    // Cambio optimista
    const updatedFollowing = !isFollowing;
    setIsFollowing(updatedFollowing);
    showToast(updatedFollowing ? `Followed @${username}` : `Unfollowed @${username}`);
    mutation.mutate();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserUpdatedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMediaFilesChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profileImage' | 'bannerImage') => {
    if (!event.target.files?.length) return;

    const file = event.target.files[0];

    try {
      const width: number = type == 'profileImage' ? 400 : 1080
      const height: number = type == 'profileImage' ? 400 : 360
      const resizedFile = await resizeImage(file, width, height);
      setUserUpdatedData((prev) => ({
        ...prev,
        [type]: resizedFile,  // Usar la imagen redimensionada
      }));
    } catch (error) {
      console.error('Error resizing image:', error);
    }
  };

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      // Inicializar las variables para las URLs de las imágenes
      let profileImageUrl = '';
      let bannerImageUrl = '';

      // Creamos una sola instancia de FormData
      const formData = new FormData();

      // Solo agregamos las imágenes que realmente existen (no nulas ni vacías)
      if (userUpdatedData.profileImage) {
        formData.append('files', userUpdatedData.profileImage);
      }

      if (userUpdatedData.bannerImage) {
        formData.append('files', userUpdatedData.bannerImage);
      }

      // Si se seleccionó al menos una imagen, proceder con la subida
      // [0]: profileImage
      // [1]: bannerImage
      if (formData.has('files')) {
        const res = await uploadFiles(formData);

        // Asignar URLs solo si las imágenes existen
        if (res[0] && res[0].data?.url) {
          profileImageUrl = res[0].data.url; // Asignar URL de la imagen de perfil
        }

        if (res[1] && res[1].data?.url) {
          bannerImageUrl = res[1].data.url; // Asignar URL de la imagen de banner
        }
      }

      // Actualizamos los datos de usuario (solo asignando lo que se ha cambiado)
      const data: Partial<UserState> = {
        fullname: userUpdatedData.fullname || undefined,
        description: userUpdatedData.description || undefined,
        profileImage: profileImageUrl || undefined,
        bannerImage: bannerImageUrl || undefined,
      };

      // Agregar los campos solo si tienen un valor
      if (userUpdatedData.fullname) {
        data.fullname = userUpdatedData.fullname;
      }

      if (userUpdatedData.description) {
        data.description = userUpdatedData.description;
      }

      if (profileImageUrl) {
        data.profileImage = profileImageUrl;
      }

      if (bannerImageUrl) {
        data.bannerImage = bannerImageUrl;
      }

      const response = await updateUser(session?.user.id!, data as UpdateUserData);

      showToast(response.message)

      // invalidar queries
      queryClient.invalidateQueries(['userProfile', user.username])
      queryClient.invalidateQueries(['creatorDataHoverCard', session?.user.id])
      queryClient.invalidateQueries(['userPosts', user.username])

      // Actualiza el estado de Redux solo con los cambios
      dispatch(setUser({
        ...user,  // Conserva las propiedades existentes para evitar undefined
        fullname: data.fullname ?? user.fullname,
        description: data.description ?? user.description,
        profileImage: profileImageUrl || user.profileImage,
        bannerImage: bannerImageUrl || user.bannerImage,
      }));

      // eliminar imagenes de perfil y banner que usaba el usuario antes
      // deleteFiles takes in a fileKey
      // eliminar su imagen de perfil anterior (si seleccionó una nueva)
      // if (profileImageUrl && user.profileImage) {
      //   await utapi.deleteFiles(user.profileImage)
      // }
      // eliminar su imagen de banner anterior (si seleccionó una nueva)
      // if (bannerImageUrl && user.bannerImage) {
      //   await utapi.deleteFiles(user.bannerImage)
      // }

      setUserUpdatedData({
        fullname: '',
        description: '',
        profileImage: null,
        bannerImage: null,
      })
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(error instanceof Error ? error.message : "Error trying to upload profile")
    } finally {
      setIsLoading(false);
    }
  };

  const openUpdateProfileModal = () => {
    handleOpenModal(
      <div className="bg-white dark:bg-neutral-800 p-3">
        {/*  */}
        <input
          ref={ProfileImageInputRef}
          type="file"
          accept="image/*"
          onChange={(event) => handleMediaFilesChange(event, 'profileImage')}
          hidden
        />
        <input
          ref={BannerImageInputRef}
          type="file"
          accept="image/*"
          onChange={(event) => handleMediaFilesChange(event, 'bannerImage')}
          hidden
        />
        {/*  */}
        <div className="relative w-full">
          {/* banner */}
          <div className='h-[150px]'>
            <img
              src={userUpdatedData.bannerImage ? URL.createObjectURL(userUpdatedData.bannerImage) : (user.bannerImage || "https://www.solidbackgrounds.com/images/1584x396/1584x396-light-sky-blue-solid-color-background.jpg")}
              className="w-full h-full object-cover"
            />
            <button onClick={() => BannerImageInputRef.current?.click()} className='hover:brightness-90 absolute top-2 right-2 w-7 h-7 text-xs rounded-full flex justify-center items-center text-white bg-black cursor-pointer'><FaCamera /></button>
          </div>
          {/* user info */}
          <div className='flex flex-col justify-center items-stretch gap-2 p-4 mt-14'>
            {/* fullname */}
            <p className="font-medium pt-2">Fullname</p>
            <input
              type="text"
              name="fullname"
              className="formInput"
              value={userUpdatedData.fullname} // Usar el estado aquí
              onChange={handleInputChange}
            />
            {/* description */}
            <p className="font-medium pt-2">Description</p>
            <textarea
              name="description"
              className="formInput"
              value={userUpdatedData.description || ""} // Usar el estado aquí
              onChange={handleInputChange}
              placeholder="Description"
            />
          </div>
          {/* profile image */}
          <div className='top-28 left-3 absolute z-20'>
            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg">
              <img
                src={userUpdatedData.profileImage ? URL.createObjectURL(userUpdatedData.profileImage) : (user.profileImage || "/default_pfp.jpg")}
                className="w-full h-full object-cover object-center cursor-pointer hover:brightness-90 duration-100"
              />
            </div>
            <button onClick={() => ProfileImageInputRef.current?.click()} className='hover:brightness-90 absolute top-2 right-2 w-7 h-7 text-xs rounded-full flex justify-center items-center text-white bg-black cursor-pointer'><FaCamera /></button>
          </div>
        </div>

        <div className="w-full mt-2 flex justify-end items-center gap-2">
          {isEditing && <button onClick={() => setUserUpdatedData({
            fullname: '',
            description: '',
            profileImage: null,
            bannerImage: null,
          })} className='w-9 h-9 flex justify-center items-center rounded-full text-red-700 border borderColor itemHover'>
            <BsTrash />
          </button>}
          <button disabled={loading} onClick={updateProfile} className={`px-4 h-9 text-white bg-orange-600 rounded-full text-sm font-medium hover:brightness-90 active:brightness-75 duration-100`}>
            {loading ? "Saving changes..." : "Save changes"}
          </button>
        </div>
      </div>
    )
  }

  // Si no hay sesión, renderiza AuthModal o nada según disableIfSameUser
  if (!session) {
    return !disableIfSameUser ? (
      <AuthModal
        buttonTrigger={<button
          className="bg-blue-600 h-9 rounded-full py-3 px-6 text-white font-medium flex justify-center items-center"
        >
          Follow
        </button>}
      />
    ) : null;
  }

  // Si el usuario logueado es el mismo y disableIfSameUser está activado, no renderiza nada
  if (disableIfSameUser && session.user.id === userId) {
    return null;
  }

  // Si el usuario logueado es el mismo, renderiza "Editar perfil"
  if (session.user.id === userId) {
    return (
      <div
        onClick={openUpdateProfileModal}
        className="h-9 rounded-full py-3 px-4 gap-3 font-medium flex justify-center items-center itemHover border border-gray-200 dark:border-neutral-700/70"
      >
        <HiPencil />
        <span>Editar perfil</span>
      </div>
    );
  }

  // Si los usuarios son distintos, renderiza Follow/Unfollow y botones adicionales
  return (
    <>
      {!isFromItem && <>
        <button className="w-9 h-9 itemHover rounded-full flex justify-center items-center border border-gray-200 dark:border-neutral-700/70">
          <IoSearchOutline />
        </button>
        {/* user profile options menu */}
        <ResponsiveMenu
          trigger={
            <button className="w-9 h-9 itemHover rounded-full flex justify-center items-center border border-gray-200 dark:border-neutral-700/70">
              <BsThreeDots />
            </button>
          }
          dropdownMenuOptions={{
            width: 300, // 300px
            canClickOtherElements: false,
          }}
        >
          {(menuOpen, setMenuOpen) => (
            <>
              {session.user?.id != userId && <OthersProfileMenu
                userId={userId}
                creatorUsername={username}
                setMenuOpen={setMenuOpen}
                states={{
                  setInitialFollowState: setInitialFollowState,
                  isFollowing: initialFollowState
                }}
              />}
            </>
          )}
        </ResponsiveMenu>
      </>}
      {isFollowing ? (
        <UnfollowUserButton onClick={e => handleFollowToggle(e)} />
      ) : (
        <FollowUserButton onClick={e => handleFollowToggle(e)} />
      )}
    </>
  );
};

export default UserProfileButtons;