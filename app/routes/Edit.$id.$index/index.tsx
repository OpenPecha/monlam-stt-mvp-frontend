import { useLoaderData } from '@remix-run/react';
import React from 'react'

const BACKEND_URL = 'http://127.0.0.1:8000';

export async function loader({ params }: { params: { id: string, index: string} }) {
    console.log(params)
    const url = `${BACKEND_URL}/projects/audiosegments/comments/${params.id}/${params.index}`;
    console.log(url)
    const response = await fetch(url, {
        method: "GET"
    }).then(response => response.json());

    return response
}

type LoaderData = {
    response: {
        comments: string;
    }
}

const comment = () => {

    const data = useLoaderData<LoaderData>();
    console.log(data)

  return (
    <div>
        Hello
    </div>
  )
}

export default comment
