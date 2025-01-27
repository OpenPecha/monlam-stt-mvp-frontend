import { useLoaderData } from "@remix-run/react"
import Navbar from "~/Component/Navbar";
import React, { act, useRef, useState } from 'react';
import 'react-h5-audio-player/lib/styles.css';
import Loading from "~/Component/Loading";
import { BiSolidCommentAdd } from "react-icons/bi";
import { IoPlayCircle } from "react-icons/io5";

const BACKEND_URL = 'http://127.0.0.1:8000';

export async function loader({ params }: { params: { id: string } }) {
    const url = `${BACKEND_URL}`;
    console.log(url)
    const response = await fetch(`${url}/projects/audiosegments/${params.id}`, {
        method: "GET"
    }).then(response => response.json());

    const link = await fetch(`${url}/projects/audiolink/${params.id}`, {
        method: "GET"
    }).then(response => response.json());

    const data = {
        response,
        link
    }


    return data;
}

type LoaderData = {
    response: {
        project_id: string;
        start_time: string;
        end_time: string;
        transcription: string;
        comments: string;
    }[];
    link: {
        audio_link: string;
    };
};

const Edit = () => {

    const data = useLoaderData<LoaderData>();
    // We'll store the transcription data in the state
    const [defaultTranscription, setDefaultTranscription] = useState(structuredClone(data.response));
    const [transcriptions, setTranscriptions] = useState(structuredClone(data.response));
    const [changes, setChanges] = useState(false);
    const [AudioPlayer, setAudioPlayer] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState(-1);
    const [loading, setLoading] = useState(false);
    const transcriptionRefs = useRef<(HTMLDivElement | null)[]>([]);

    React.useEffect(() => {
        // Dynamically import so it only runs on the client
        import('react-h5-audio-player').then(mod => {
          setAudioPlayer(() => mod.default);
        });
    }, []);

    const playerRef = React.useRef<any>(null);
    if (!AudioPlayer) {
        return null; // Don’t render on the server
    }
    

    // Handler to update transcription state when the input changes
    const handleTranscriptionChange = (index: number, newTranscription: string) => {
        setChanges(true);
        const updatedTranscriptions = [...transcriptions];
        updatedTranscriptions[index].transcription = newTranscription;
        setTranscriptions(updatedTranscriptions);
    };

    const update = async () => {

        setLoading(true);

        const url = `${BACKEND_URL}/projects/audiosegments/update`;

        transcriptions.forEach(async (item, index) => {
            if (item.transcription !== defaultTranscription[index].transcription) {

                const data = JSON.stringify({
                    project_id: item.project_id,
                    sequence: index,
                    transcription: item.transcription,
                    comments: item.comments || ""
                });
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: data
                });
                if (response.ok) {
                    console.log('Updated');
                } else {
                    console.log(`Failed to update at index ${index}`);
                }
            }
        })
        setLoading(false);
    }

    const handlelisten = (currentTime: any) => {
        console.log('my time ', currentTime)
        if (playerRef.current) {
            setCurrentTime(() => currentTime);
            playerRef.current.audio.current.currentTime = currentTime;
            playerRef.current.audio.current.play();
        }
    }


    const handleHighlight = (e: any) => {
        console.log('audio Time: ', e.target.currentTime);
        setCurrentTime(() => e.target.currentTime);
        const nowTime = e.target.currentTime;
        const activeIndex = transcriptions.findIndex(
            (item) => {
                return parseFloat(String(nowTime)) >= parseFloat(item.start_time) && parseFloat(String(currentTime)) <= parseFloat(item.end_time);
            }
        );
        if (activeIndex !== -1 && transcriptionRefs.current[activeIndex]) {
            transcriptionRefs.current[activeIndex].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }

    return (
        <>
            <Navbar />
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
                <AudioPlayer 
                    ref={playerRef}
                    autoPlay={false}
                    src={data.link.audio_link}
                    onListen={((e: any) => handleHighlight(e))}
                />
            </div>
            {loading ? <Loading /> : ''}
            <div className=" flex pl-10 pt-2">
                <h1 className=" text-2xl">Project Name</h1>
                <button disabled={!changes} className=" ml-28 flex items-center pl-6 pr-6 pt-2 pb-2 rounded-lg bg-green-500 border border-black hover:bg-green-600 cursor-pointer active:opacity-60 active:mt-2 transition-all duration-300" onClick={update}>Save</button>
            </div>

            <div className="flex p-10">
                <div className="w-[18%]">
                    <h1 className="font-semibold text-2xl pl-4">Time Stamp</h1>
                </div>
                <div className="w-3/4">
                    <h1 className="font-semibold text-2xl">Transcription</h1>
                </div>
            </div>
            {transcriptions.map((item, index) => (
                <div className=" pl-12 pr-12">
                    <div key={index} ref={(el) => (transcriptionRefs.current[index] = el)} className={`flex pl-4 pb-2 ${parseFloat(String(currentTime)) >= parseFloat(item.start_time) && parseFloat(String(currentTime)) <= parseFloat(item.end_time) ? ' border-2 border-yellow-500 rounded-xl' : ''}`}>
                        <div className="w-[18%] flex justify-between items-center">
                            <div className=" flex items-center cursor-pointer text-xl" onClick={() => handlelisten(item.start_time)}>
                                <IoPlayCircle  /><span className=" ml-2">{new Date(parseFloat(item.start_time) * 1000).toISOString().substr(11, 8)}</span>
                            </div>
                        </div>
                        <div className="flex w-3/4 mt-2 group">
                            <input
                                type="text"
                                value={item.transcription}
                                onChange={(e) => handleTranscriptionChange(index, e.target.value)}
                                className="h-full w-3/4 font-monlam p-2 rounded-lg outline-none border border-dashed border-black"
                            />
                            <BiSolidCommentAdd className="cursor-pointer ml-2 mt-1 hidden group-hover:block" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Edit;
