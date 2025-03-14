import React, { useEffect } from 'react'
import DropDown from './DropDown';
import { useNavigate } from '@remix-run/react';
import Loading from './Loading';

type NewProjectPopupProps = {
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProjectData {
    email: string;
    project_name: string;
    model: string;
    file: File;
}

type DataType = {
    project_name: string;
    file: File | null;
    model: string;
}

const BACKEND_URL = 'http://127.0.0.1:8000';
const email = 'tenzintsering630@gmail.com';

const NewProjectPopup = ({setPopup} : NewProjectPopupProps) => {

    const navigate = useNavigate();

    const [data, setData] = React.useState<DataType>({
        project_name: '',
        file: null,
        model: '',
    });
    
    const [modelOption, setModelOption] = React.useState<string[]>([]);
    const [modelDropDown, setModelDropDown] = React.useState<boolean>(false);
    const [selectedModel, setSelectedModel] = React.useState<string>('Select a Model');
    const [disableSubmit, setDisableSubmit] = React.useState<boolean>(false);
    const [loading ,setLoading] = React.useState<boolean>(false);

    const [alertProjectName, setalertProjectName] = React.useState<string>('');
    const [alertFile, setalertFile] = React.useState<string>('');
    const [alertModel, setalertModel] = React.useState<string>('');

    const project_name_ref = React.useRef<HTMLInputElement>(null);

    const submiteData = async () => {

        setLoading(true);

        setDisableSubmit(true);
        let check = true;
    
        try {
            // Form validation
            if (data.project_name.trim() === '') {
                setalertProjectName('Project name is required');
                check = false;
            }
            if (!data.file) {
                setalertFile('File is required');
                check = false;
            }
            if (!check) {
                setDisableSubmit(false);
                return;
            }
    
            // Create FormData
            const formData = new FormData();
            formData.append('file', data.file!);

            formData.append('email', email)
            formData.append('project_name', data.project_name.replace(/\s+/g, '_'))
            formData.append('model', data.model)
    
            // Send request
            const response = await fetch(`${BACKEND_URL}/projects/create`, {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Handle success
            navigate(0);
            setLoading(false);
            setPopup(false);
            
        } catch (error) {
            setLoading(false)
            alert(`Error: ${error}`);
            console.error('Error:', error);
            setDisableSubmit(false);
        }
    };

    const project_name_change = () => {
        setData((prev) => ({ ...prev, project_name: project_name_ref.current!.value }));
    }

    useEffect(() => {
        if (selectedModel !== 'Select a Model') {
            setData((prev) => ({ ...prev, model: selectedModel }));
        }
    },[selectedModel]);

  return (
    <div className=" overflow-x-auto z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setPopup(false)}>
        <div className=" bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 w-2/4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold">New Project</h2>
            
            <div className=' mt-3 mb-2'>Project Name <span className='text-red-600'>*</span></div>
            <input type="text" placeholder='Project Name' className=" pl-2 pr-2 w-full h-11 border border-gray-300 rounded p-1" ref={project_name_ref} onChange={() => project_name_change()}/>
            <span className='text-red-600'>{alertProjectName}</span>

            <div className=' mt-4'>Upload File (WAV OR MP3 OR MPEG) <span className='text-red-600'>*</span></div>
            <div className=" relative grid items-center justify-center border border-dashed border-gray-400 rounded p-1 mt-4 h-48">
                <div className=' flex justify-center text-gray-500 w-full overflow-x-auto'>
                    Selected File : {data.file?.name}
                </div>
                <input
                    type="file"
                    accept=".wav,.mp3,.mpeg"
                    className="hidden w-2/2 h-2/2 cursor-pointer"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            setData((prev) => ({ ...prev, file }));
                        }
                    }}
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer w-full h-full flex items-center justify-center">
                    <div className="text-gray-500 flex justify-center">Click to Upload or Drag and Drop</div>
                    <div className="text-gray-500 flex justify-center">.WAV or .MP3 upto 1hr</div>
                </label>
            </div>
            <span className='text-red-600'>{alertFile}</span>
            
            <div className=' mt-4'>Select STT Model</div>
            <div className=' h-11 cursor-pointer border border-gray-300 rounded pl-4 pt-2 mt-2' onClick={() => setModelDropDown(!modelDropDown)}>    
                {selectedModel}
            </div>
            <span className='text-red-600'>{alertModel}</span>
            {modelDropDown ? <DropDown data={modelOption} select={setSelectedModel} dropdown={setModelDropDown}/> : null}
            <div className=' flex items-center justify-between mt-4'>
                <button
                    disabled={disableSubmit}
                    onClick={() => {
                        submiteData();
                    }}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                    >
                    Submit
                </button>
                <button
                    onClick={() => setPopup(false)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                    >
                    Close
                </button>
            </div>
            {loading ? <Loading /> : null}
          </div>
    </div>
  )
}

export default NewProjectPopup
