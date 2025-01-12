import ResponsiveMenu from '../ResponsiveMenu';
import LoggedOut from '../auth/LoggedOut';
import LoggedIn from '../auth/LoggedIn';
import useUser from '@/hooks/useUser';
import { GuestPostMenu, OwnerPostMenu, OtherUserPostMenu } from '@/components/PostItemsComponent';
import { BsThreeDots } from 'react-icons/bs';


// Corrección de los tipos de estados con Dispatch<SetStateAction<boolean>>
interface PostStates {
  isPinned: boolean;
  setInitialPinnedState: React.Dispatch<React.SetStateAction<boolean>>;
  isHighlighted: boolean;
  isOnList: boolean;
  isConversationMuted: boolean;
}

interface OtherUserStates {
  isFollowing: boolean;
  setInitialFollowState: React.Dispatch<React.SetStateAction<boolean>>;
  isOnList: boolean;
  isUserMuted: boolean;
  isBlocked: boolean;
}

interface PostOptionsMenuProps {
  creator: {
    username: string;
    _id: string;
  };
  maskedId: string;
  _id: string;
  quotedPost?: boolean;
  states: PostStates;
  otherUserStates: OtherUserStates;
}

const PostOptionsMenu: React.FC<PostOptionsMenuProps> = ({
  creator,
  maskedId,
  _id,
  quotedPost,
  states,
  otherUserStates,
}) => {
  const user = useUser();

  return (
    <ResponsiveMenu
      trigger={
        <button className="postButton">
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
          <LoggedOut>
            <GuestPostMenu creatorUsername={creator.username} postId={maskedId} setMenuOpen={setMenuOpen} />
          </LoggedOut>
          <LoggedIn>
            <>
              {user?.username === creator.username ? (
                <OwnerPostMenu
                  type={quotedPost ? 'quote' : 'normal'}
                  creatorUsername={creator.username}
                  userId={creator._id}
                  postId={_id}
                  setMenuOpen={setMenuOpen}
                  states={states}
                />
              ) : (
                <OtherUserPostMenu
                  userId={creator._id}
                  creatorUsername={creator.username}
                  postId={maskedId}
                  setMenuOpen={setMenuOpen}
                  states={otherUserStates}
                />
              )}
            </>
          </LoggedIn>
        </>
      )}
    </ResponsiveMenu>
  );
};

export default PostOptionsMenu;