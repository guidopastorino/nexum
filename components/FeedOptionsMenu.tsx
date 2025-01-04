import useToast from "@/hooks/useToast";
import ky from "ky";
import { BsCrosshair, BsPlus, BsTrash } from "react-icons/bs"

// opciones para el menu del feed del creador
interface OwnerFeedOptionsMenuProps {
  creatorId: string,
  creatorUsername: string,
  feedMaskedId: string,
  feedTitle: string,
  setMenuOpen: (open: boolean) => void;
}

export const OwnerFeedOptionsMenu = ({
  creatorId,
  creatorUsername,
  feedMaskedId,
  feedTitle,
  setMenuOpen
}: OwnerFeedOptionsMenuProps) => {
  return (
    <>
      <MenuOptionItem
        icon={<BsTrash />}
        text="Delete feed"
        onClick={() => setMenuOpen(false)}
      />
      <MenuOptionItem
        icon={<BsTrash />}
        text="Edit feed"
        onClick={() => setMenuOpen(false)}
      />
      <MenuOptionItem
        icon={<BsTrash />}
        text="Delete feed"
        onClick={() => setMenuOpen(false)}
      />
      <MenuOptionItem
        icon={<BsTrash />}
        text="Delete feed"
        onClick={() => setMenuOpen(false)}
      />
      <MenuOptionItem
        icon={<BsTrash />}
        text="Delete feed"
        onClick={() => setMenuOpen(false)}
      />
      <MenuOptionItem
        icon={<BsTrash />}
        text="Delete feed"
        onClick={() => setMenuOpen(false)}
      />
    </>
  )
}

// 

interface MenuOptionItemProps {
  icon: React.ReactNode;
  text: string;
  onClick: any;
}

/*
  Usage:
  <MenuOptionItem
    icon={<SomeIcon />}
    text="some text"
    onClick={() => setMenuOpen(false)}
  />
*/

const MenuOptionItem = ({ icon, text, onClick }: MenuOptionItemProps) => {
  return (
    <div className="itemClass" onClick={onClick}>
      {icon}
      <span>{text}</span>
    </div>
  )
}