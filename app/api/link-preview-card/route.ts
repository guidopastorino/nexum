import scrapeMeta from 'metadata-scraper'
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL no proporcionada' }, { status: 400 })
    }

    try {
      const metadata = await scrapeMeta(url);
      return NextResponse.json(
        {
          title: metadata.title,
          description: metadata.description,
          image: metadata.image,
        },
        { status: 200 }
      )
    } catch (error) {
      return NextResponse.json({ error: 'No se pudo obtener la metadata.' }, { status: 500 })
    }
  } catch (error) {
    console.log(error)
  }
}