import { useLoaderData } from "@remix-run/react"
import Navbar from "~/Component/Navbar";
import React, { act, useRef, useState } from 'react';
import 'react-h5-audio-player/lib/styles.css';
import Loading from "~/Component/Loading";

const BACKEND_URL = 'http://127.0.0.1:8000';

export async function loader({ params }: { params: { id: string } }) {
    const url = `${BACKEND_URL}/projects/audiosegments/${params.id}`;
    console.log(url)
    const response = await fetch(url, {
        method: "GET"
    }).then(response => response.json());

    return response;
}

type LoaderData = {
    project_id: string;
    start_time: string;
    end_time: string;
    transcription: string;
    comments: string;
}[];

const Edit = () => {

    const data = useLoaderData<LoaderData>();
    // We'll store the transcription data in the state
    const [defaultTranscription, setDefaultTranscription] = useState(structuredClone(data));
    const [transcriptions, setTranscriptions] = useState(structuredClone(data));
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

    React.useEffect(() => {
        const activeIndex = transcriptions.findIndex(
            (item) => {
                return parseFloat(String(currentTime)) >= parseFloat(item.start_time) && parseFloat(String(currentTime)) < parseFloat(item.end_time);
            }
        );
        if (activeIndex !== -1 && transcriptionRefs.current[activeIndex]) {
            transcriptionRefs.current[activeIndex].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [currentTime])

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
        if (playerRef.current) {
            console.log(currentTime)
            playerRef.current.audio.current.currentTime = currentTime;
            playerRef.current.audio.current.play();
        }
    }


    const handleHighlight = (e: any) => {
        const currentTime = e.target.currentTime;
        const formattedTime = currentTime.toFixed(1);
        setCurrentTime(formattedTime);
    }

    return (
        <>
            <Navbar />
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
                <AudioPlayer 
                    ref={playerRef}
                    autoPlay={false}
                    src="https://monlam-ai-web-testing.s3.ap-south-1.amazonaws.com/1737786666481-movie_audio.mp3"
                    onListen={((e: any) => handleHighlight(e))}
                />
            </div>
            {loading ? <Loading /> : ''}
            <div className=" flex space-x-56 pl-10 pt-2">
                <h1 className=" text-2xl">Project Name</h1>
                <button disabled={!changes} className=" flex items-center pl-6 pr-6 pt-2 pb-2 rounded-lg bg-green-500 border border-black hover:bg-green-600 cursor-pointer active:opacity-60 active:mt-2 transition-all duration-300" onClick={update}>Save</button>
            </div>

            <div className="flex p-10">
                <div className="w-1/4">
                    <h1 className="font-semibold text-2xl">Time Stamp</h1>
                </div>
                <div className="w-3/4">
                    <h1 className="font-semibold text-2xl">Transcription</h1>
                </div>
            </div>
            {transcriptions.map((item, index) => (
                <div className=" pl-12 mb-4 pr-12">
                    <div key={index} ref={(el) => (transcriptionRefs.current[index] = el)} className={`flex pl-4 pb-2 ${parseFloat(String(currentTime)) >= parseFloat(item.start_time) && parseFloat(String(currentTime)) < parseFloat(item.end_time) ? ' border-2 border-yellow-500 rounded-xl' : ''}`}>
                        <div className="w-1/4 flex justify-between items-center">
                            <div className=" cursor-pointer text-xl" onClick={() => handlelisten(item.start_time)}>{item.start_time}</div>
                        </div>
                        <div className="w-3/4 text-xl mt-2">
                            <input
                                type="text"
                                value={item.transcription}
                                onChange={(e) => handleTranscriptionChange(index, e.target.value)} // Update transcription
                                className="w-3/4 p-2 pb-3 rounded-lg outline-none border border-dashed border-black"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Edit;
