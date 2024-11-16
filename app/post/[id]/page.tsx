"use client";

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const searchParams = useSearchParams();

  // Use local state to save `retweetedBy` once, and avoid missing it when URL params are hidden
  const [retweetedBy, setRetweetedBy] = useState<string>("");

  useEffect(() => {
    const param = searchParams.get('retweetedBy') || "aaa";
    setRetweetedBy(param);
  }, [searchParams]);

  return (
    <div>
      <div>Post ID: {id}</div>
      {retweetedBy && <div>Retweeted by: {retweetedBy}</div>}
    </div>
  );
};

export default Page;
