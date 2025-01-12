import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from '../store/modal/modalSlice';
import { RootState } from '@/store';
import { useEffect } from 'react';

const useModal = (modalId: string) => {
  const dispatch = useDispatch();
  
  const isModalOpen = useSelector(
    (state: RootState) => state.modal.modalId === modalId
  );

  const handleOpenModal = (content: React.ReactNode) => {
    dispatch(openModal({ modalId, content }));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    const element = document.body
    if(element){
      if(isModalOpen){
        element.classList.add('modalOpen')
      } else {
        element.classList.remove('modalOpen')
      }
      return () => element.classList.remove('modalOpen')
    }
  }, [isModalOpen])

  return {
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
  };
};

export default useModal;
