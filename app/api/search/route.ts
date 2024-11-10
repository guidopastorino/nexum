import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Extraer los parámetros de la query de la URL
  const url = new URL(req.url);
  const query = url.searchParams.get('query');
  const limit = url.searchParams.get('limit') || '10';  // Default limit is 10
  const page = url.searchParams.get('page') || '1';  // Default page is 1

  // Validar el query
  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  try {
    await dbConnect(); // Conectar a la base de datos

    // Convertir limit y page a enteros
    const limitInt = parseInt(limit, 10);
    const pageInt = parseInt(page, 10);

    // Validar los valores de limit y page
    if (isNaN(limitInt) || isNaN(pageInt) || limitInt <= 0 || pageInt <= 0) {
      return NextResponse.json({ error: "Invalid limit or page values" }, { status: 400 });
    }

    // Buscar usuarios
    const userResults = await User.find({
      $or: [
        { fullname: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
      ]
    })
      .limit(limitInt)
      .skip((pageInt - 1) * limitInt)
      .select('fullname username profileImage') // Solo devolver estos campos
      .lean();

    // Buscar posts
    const postResults = await Post.find({
      content: { $regex: query, $options: 'i' },
    })
      .limit(limitInt)
      .skip((pageInt - 1) * limitInt)
      .select('content tags creatorId')
      .populate('creatorId', 'username profileImage')  // Llenar con el usuario que creó el post
      .lean();

    console.log(postResults)

    // Calcular si hay una página siguiente
    const hasNextPage = userResults.length === limitInt || postResults.length === limitInt;

    // Devolver los resultados con paginación
    return NextResponse.json({
      users: userResults,
      posts: postResults,
      pagination: {
        currentPage: pageInt,
        nextPage: hasNextPage ? pageInt + 1 : null,
        prevPage: pageInt > 1 ? pageInt - 1 : null,
        totalResults: userResults.length + postResults.length,
      },
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al realizar la búsqueda' }, { status: 500 });
  }
}