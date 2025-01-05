export const postPopulateOptions = [
  {
    path: "creator",
    select: "_id profileImage fullname username",
  },
  {
    path: "repostedFrom",
    select:
      "_id maskedId creator communityId feedId content quotedPost media likes comments bookmarks quotes reposts type communityId feedId createdAt",
    populate: [
      {
        path: "creator",
        select: "_id profileImage fullname username",
      },
      {
        path: "quotedPost",
        select: "_id maskedId creator content media createdAt",
        populate: {
          path: "creator",
          select: "_id profileImage fullname username",
        },
      },
    ],
  },
  {
    path: "quotedPost",
    select: "creator maskedId content media createdAt",
    populate: {
      path: "creator",
      select: "_id profileImage fullname username",
    },
  },
  {
    path: "comments",
    select: "_id content createdAt",
  },
];

// Base case
export const postSelectionFields =
  "_id maskedId content media likes comments bookmarks quotes reposts type communityId feedId createdAt";