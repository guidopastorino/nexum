import { Metadata } from 'next';
import SearchPage from './SearchPage';

// Tipos para los parámetros de contexto de generateMetadata
interface SearchParams {
  query?: string;
}

interface Props {
  params: Record<string, string>;
  searchParams: SearchParams;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = searchParams.query || '';
  return {
    title: `Search "${query}" on Nexum`,
    description: `Search results for "${query}" on Nexum`,
  };
}

const page = () => {
  return (
    <div>
      <SearchPage />
    </div>
  );
};

export default page;