import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import '@/models/';
import User from '@/models/User';
import generateSqid from '@/utils/generateSqid';

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