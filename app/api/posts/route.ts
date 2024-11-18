import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import '@/models/';
import User from '@/models/User';
import generateSqid from '@/utils/generateSqid';

// Paginación basada en 'cursores' (cursor paginations)
// ========================================
// Obtener todos los posts
// Paginación basada en 'cursores' (cursor paginations)
// URL de ejemplo con cursor:
// http://localhost:3000/api/posts?pageSize=5&cursor=2024-11-17T09:00:00.000Z
// (Se debe cambiar el fetch en /app/page.tsx y el hook de useInfiniteScroll (considerar que se usa para cualquier componente))
// export async function GET(req: Request) {
//   try {
//     await dbConnect();

//     const url = new URL(req.url);
//     const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
//     const cursor = url.searchParams.get('cursor'); // Referencia para paginación basada en cursor

//     const matchStage = cursor
//       ? { createdAt: { $lt: new Date(cursor) } }
//       : {}; // Si no hay cursor, no aplica filtro

//     // Usar un pipeline de agregación para optimizar la consulta
//     const posts = await Post.aggregate([
//       { $match: matchStage }, // Filtrar posts según el cursor
//       { $sort: { createdAt: -1 } }, // Ordenar por fecha de creación (más reciente primero)
//       { $limit: pageSize }, // Limitar resultados al tamaño de página
//       {
//         $lookup: {
//           from: 'users', // Relación con la colección de usuarios
//           localField: 'creator',
//           foreignField: '_id',
//           as: 'creatorInfo',
//         },
//       },
//       { $unwind: '$creatorInfo' }, // Descomponer el array de usuarios
//       {
//         $lookup: {
//           from: 'posts', // Relación con reposts
//           localField: 'repostedFrom',
//           foreignField: '_id',
//           as: 'repostedFromInfo',
//         },
//       },
//       { $unwind: { path: '$repostedFromInfo', preserveNullAndEmptyArrays: true } },
//       {
//         $lookup: {
//           from: 'comments', // Relación con comentarios
//           localField: 'comments',
//           foreignField: '_id',
//           as: 'commentsInfo',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           maskedId: 1,
//           content: 1,
//           media: 1,
//           likes: 1,
//           type: 1,
//           createdAt: 1,
//           communityId: 1,
//           feedId: 1,
//           'creatorInfo._id': 1,
//           'creatorInfo.profileImage': 1,
//           'creatorInfo.fullname': 1,
//           'creatorInfo.username': 1,
//           repostedFrom: '$repostedFromInfo',
//           comments: { $slice: ['$commentsInfo', 3] }, // Limitar los comentarios a 3 por post
//         },
//       },
//     ]);

//     // Incluir el siguiente cursor en la respuesta para la paginación
//     const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt : null;

//     return NextResponse.json({ posts, nextCursor }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Error al obtener los posts' }, { status: 500 });
//   }
// }
//
// ====================================

// Obtener todos los posts
export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    const posts = await Post.find()
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: 'creator',
        select: '_id profileImage fullname username',
      })
      .populate({
        path: 'repostedFrom',
        select: '_id maskedId creator communityId feedId content likes media type comments quotedPost createdAt',
        populate: [
          {
            path: 'creator',
            select: '_id profileImage fullname username'
          },
          {
            path: 'quotedPost',
            select: '_id maskedId creator content media createdAt',
            populate: {
              path: 'creator',
              select: '_id profileImage fullname username'
            }
          }
        ]
      })
      .populate({
        path: 'quotedPost',
        select: 'creator maskedId content media createdAt',
        populate: { path: 'creator', select: '_id profileImage fullname username' },
      })
      .populate({
        path: 'comments',
        select: '_id content createdAt',
        model: 'Comment',
      })
      .select('_id maskedId content media likes type createdAt communityId feedId')
      .sort({ createdAt: -1 });



    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener los posts' }, { status: 500 });
  }
}

// Crear un post
export async function POST(req: Request, res: Response) {
  try {
    await dbConnect();

    // 'creator' es MUY importante recibirlo, ya que es el id del user que se le guardará este post
    const { creator, communityId, feedId, content, repostedFrom, quotedPost, media, type } = await req.json()

    if (!creator || (!content && media?.length === 0) || !type) {
      return NextResponse.json({ message: "Cannot create post with incomplete data" }, { status: 400 });
    }

    // checkear tipo y crear el post en base a las propiedades que debe recibir cada tipo
    let newPost = null;

    // Generar maskedId para el post (sirve para las rutas /post/... del cliente)
    const maskedId = generateSqid()

    // Es como manejar diferentes rutas pero en una sola, asi que la lógica de cada ruta irá dentro de su respectivo condicional
    if (type === 'normal') {
      newPost = await new Post({
        type,
        maskedId,
        creator,
        content,
        media,
        communityId,
        feedId,
      })
    } else if (type === 'quote') {
      newPost = await new Post({
        type,
        maskedId,
        creator,
        content,
        media,
        quotedPost,
        communityId,
        feedId,
      })
    } else if (type === 'repost') {
      // Los reposts solamente existen para los feeds (feed de donde se reposteó) o el perfil del usuario
      newPost = await new Post({
        type,
        maskedId,
        creator,
        repostedFrom
      })
    } else {
      // Tipo de post inválido
      return NextResponse.json({ message: "Invalid post type" }, { status: 400 });
    }

    // Buscar el usuario que se le guardará este post
    const user = await User.findById(creator)

    if (!user) {
      return NextResponse.json({ message: "Creador del post no encontrado. No es posible crear el post" }, { status: 404 })
    }

    // Guardar el post en el array 'posts' del usuario
    user.posts.push(newPost._id)

    // Guardar (si corresponde) al post en el array 'posts' del feed y comunidad
    // ...

    // Guardar el usuario con su array actualizado
    await user.save()

    // Guardar el post en la base de datos
    await newPost.save()

    return NextResponse.json({ message: "Post creado exitosamente" }, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}