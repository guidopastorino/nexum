import User from "@/models/User";
import { Types } from "mongoose";

type UserState = {
  isFollowingUser: boolean;
  isFollowedByUser: boolean;
};

/**
 * Calcula los estados de seguimiento entre dos usuarios.
 * @param userId ID del usuario logueado (puede ser nulo si no está autenticado).
 * @param targetUserId ID del usuario objetivo.
 * @returns Un objeto con los estados isFollowingUser e isFollowedByUser.
 */

export async function getUserStates(userId: string | null, targetUserId: string): Promise<UserState> {
  if (!userId || userId === targetUserId) {
    return { isFollowingUser: false, isFollowedByUser: false };
  }

  // Obtener el usuario logueado y el usuario objetivo
  const loggedInUser: any = await User.findById(userId).select("followers following").lean();
  const targetUser: any = await User.findById(targetUserId).select("followers following").lean();

  if (!loggedInUser || !targetUser) {
    return { isFollowingUser: false, isFollowedByUser: false };
  }

  return {
    // Si este usuario (targetUserId) sigue al usuario logueado (userId)
    isFollowingUser: loggedInUser.following.some(
      (following: Types.ObjectId) => following.toString() === targetUserId
    ),
    // Si el usuario logueado (userId) sigue a este usuario (targetUserId)
    isFollowedByUser: loggedInUser.followers.some(
      (follower: Types.ObjectId) => follower.toString() === targetUserId
    ),
  };
}
