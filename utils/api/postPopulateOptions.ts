// Base case
export const postSelectionFields =
  "_id maskedId content media likes replies bookmarks quotes reposts type communityId feedId parentPost replyingTo createdAt";

export const postPopulateOptions = [
  {
    path: "creator",
    select: "_id profileImage fullname username",
  },
  {
    path: "repostedFrom",
    select:
      "_id maskedId creator communityId feedId content quotedPost media likes replies bookmarks quotes reposts type communityId feedId parentPost replyingTo createdAt",
    populate: [
      {
        path: "creator",
        select: "_id profileImage fullname username",
      },
      {
        path: "quotedPost",
        select: "_id maskedId creator content media parentPost replyingTo createdAt",
        populate: {
          path: "creator",
          select: "_id profileImage fullname username",
        },
      },
    ],
  },
  {
    path: "quotedPost",
    select: "creator maskedId content media parentPost replyingTo createdAt",
    populate: {
      path: "creator",
      select: "_id profileImage fullname username",
    },
  },
  {
    path: "replies",
    select: "_id maskedId creator communityId content likes replies bookmarks quotes reposts media parentPost replyingTo type createdAt",
  },
  {
    path: "parentPost",
    select: postSelectionFields,
    populate: {
      path: "creator",
      select: "_id fullname username profileImage",
    },
  },
  {
    path: "replyingTo",
    select: "_id username",
  },
];