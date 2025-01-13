import dbConnect from '@/lib/dbConnect';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';
import '@/models/';
import User from '@/models/User';
import generateSqid from '@/utils/generateSqid';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/utils/api/auth-options/authOptions";
import { postPopulateOptions, postSelectionFields } from '@/utils/api/postPopulateOptions';
import { mapPostData } from '@/utils/api/mapPostData';


// Obtener todos los posts
export async function GET(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user.id || null;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "35");
    const skip = (page - 1) * pageSize;

    // Obtenemos los posts y les asignamos un valor aleatorio para ordenar
    const posts = await Post.find()
      .skip(skip)
      .limit(pageSize)
      .populate(postPopulateOptions)
      .select(postSelectionFields);

    // Asignamos un valor aleatorio a cada post
    const postsWithRandomOrder = posts.map(post => ({
      ...post.toObject(),
      randomValue: Math.random() // Generamos un valor aleatorio para cada post
    }));

    // Ordenamos por el valor aleatorio
    postsWithRandomOrder.sort((a, b) => a.randomValue - b.randomValue);

    // Mapeamos los datos enriquecidos como en tu implementación original
    const enrichedPosts = await mapPostData(postsWithRandomOrder, userId);

    return NextResponse.json(enrichedPosts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener los posts" }, { status: 500 });
  }
}

// 

// Crear un post
export async function POST(req: Request, res: Response) {
  // Verificar si la sesión está activa
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
  }

  const userId = session.user.id;

  try {
    await dbConnect();

    // datos del request
    const { communityId, feedId, content, repostedFrom, quotedPost, media, type } = await req.json();

    // Validar los datos necesarios para crear un post
    if ((!content && media?.length === 0) || !type) {
      return NextResponse.json({ message: "Cannot create post with incomplete data" }, { status: 400 });
    }

    // Generar maskedId para el post
    const maskedId = generateSqid();

    // Inicializar la variable del nuevo post
    let newPost = await createNewPost(type, userId, maskedId, content, media, repostedFrom, quotedPost, communityId, feedId);

    // Si el tipo de post es inválido, retornar error
    if (!newPost) {
      return NextResponse.json({ message: "Invalid post type" }, { status: 400 });
    }

    // Buscar el usuario para asegurarse de que existe
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "Creador del post no encontrado. No es posible crear el post" }, { status: 404 });
    }

    // Guardar el post en el array 'posts' del usuario
    user.posts.push(newPost._id);

    // Procesar repost y quotes
    if (type === 'repost') {
      if (!repostedFrom) {
        return NextResponse.json({ message: "RepostedFrom ID is missing" }, { status: 400 });
      }

      try {
        // Manejar el repost
        await handleRepost(repostedFrom, userId);
      } catch (error) {
        console.error("Error handling repost:", error);
        return NextResponse.json({ message: "Unknown error when handling repost" }, { status: 500 });
      }
    } else if (type === 'quote') {
      if (!quotedPost) {
        return NextResponse.json({ message: "QuotedPost ID is missing" }, { status: 400 });
      }

      try {
        // Manejar el quote
        await handleQuote(quotedPost, newPost._id);
      } catch (error) {
        console.error("Error handling quote:", error);
        return NextResponse.json({ message: "Unknown error when handling quote" }, { status: 500 });
      }
    }

    // Guardar el usuario con su array actualizado
    await user.save();

    // Guardar el post en la base de datos
    await newPost.save();

    return NextResponse.json({ message: "Post creado exitosamente" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Función para crear un nuevo post dependiendo del tipo
async function createNewPost(type: string, userId: string, maskedId: string, content: string, media: any[], repostedFrom: any, quotedPost: any, communityId: string, feedId: string) {
  switch (type) {
    case 'normal':
      return new Post({
        type,
        maskedId,
        creator: userId,
        content,
        media,
        communityId,
        feedId,
      });
    case 'quote':
      return new Post({
        type,
        maskedId,
        creator: userId,
        content,
        media,
        quotedPost,
        communityId,
        feedId,
      });
    case 'repost':
      return new Post({
        type,
        maskedId,
        creator: userId,
        repostedFrom
      });
    default:
      return null;
  }
}

// Función para manejar el repost y agregar el usuario al array de 'reposts'
async function handleRepost(repostedFromId: string, userId: string) {
  // Buscar el post original basado en el ID
  const repostedPost = await Post.findById(repostedFromId);

  if (!repostedPost) {
    throw new Error(`Post with ID ${repostedFromId} not found`);
  }

  // Asegurarse de que el array 'reposts' existe y está inicializado
  if (!repostedPost.reposts) {
    repostedPost.reposts = [];
  }

  // Agregar el userId al array de 'reposts' si no está ya presente
  if (!repostedPost.reposts.includes(userId)) {
    repostedPost.reposts.push(userId);
    await repostedPost.save();
  }
}

// Función para manejar el quote y agregar el nuevo post al array 'quotes'
async function handleQuote(quotedPostId: string, newPostId: string) {
  // Buscar el post original basado en el ID
  const quotedPost = await Post.findById(quotedPostId);

  if (!quotedPost) {
    throw new Error(`Post with ID ${quotedPostId} not found`);
  }

  // Asegurarse de que el array 'quotes' existe y está inicializado
  if (!quotedPost.quotes) {
    quotedPost.quotes = [];
  }

  // Agregar el newPostId al array 'quotes' si no está ya presente
  if (!quotedPost.quotes.includes(newPostId)) {
    quotedPost.quotes.push(newPostId);
    await quotedPost.save();
  }
}