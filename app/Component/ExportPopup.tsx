import React from 'react'

type ExportPopupProp = {
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const BACKEND_URL = 'http://127.0.0.1:8000';
const email = 'tenzintsering630@gmail.com';

const ExportPopup = ({setPopup, project_id}: ExportPopupProp & {project_id: string}) => {
    const [format, setFormat] = React.useState<string>('');
    const [disableSubmit, setDisableSubmit] = React.useState<boolean>(true);

    const handleChange = (event: any) => {
        setDisableSubmit(false);
        setFormat(event.target.value.toLowerCase());
    };

    const download = async () => {
        setDisableSubmit(true);
        // api call
        console.log(email, project_id, format);
        const url = `${BACKEND_URL}/projects/download/${email}/${project_id}/${format}`;

        const link = document.createElement("a");
        link.href = url;
        link.download = "filename";

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
    }

  return (
    <div className=" overflow-x-auto z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setPopup(false)}>
        <div className=" bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 w-1/4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold">Export</h2>
            <div className=' mt-3 mb-2'>Select the format to export <span className=' text-red-600'>*</span></div>
            <div className=' flex items-center'>
                <div className=' border border-grey rounded-lg p-2 cursor-pointer'>
                    <div className=' flex items-center'>
                        <input value="TXT" type='radio' name='export' className='mr-2' onChange={handleChange}/>
                        <div>TXT</div>
                    </div>
                </div>
                <div className=' border border-grey rounded-lg p-2 cursor-pointer ml-2'>
                    <div className=' flex items-center'>
                        <input value="SRT" type='radio' name='export' className='mr-2  border border-grey rounded-lg p-2 cursor-pointer ml-2' onChange={handleChange}/>
                        <div>SRT</div>
                    </div>
                </div>
            </div>
            <button className={` mt-4 border-none p-2 rounded-lg text-white  ${disableSubmit ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-green-700 cursor-pointer hover:opacity-80 active:opacity-60'}`} disabled={disableSubmit} onClick={download}>Download</button>
            <button className={` ml-4 mt-4 border-none p-2 rounded-lg text-white bg-red-700 cursor-pointer hover:opacity-80 active:opacity-60`} onClick={() => setPopup(false)}>Close</button>
        </div>
    </div>
  )
}

export default ExportPopup
