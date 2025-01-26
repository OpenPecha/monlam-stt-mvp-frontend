import React, { useEffect } from 'react'
import NewProjectPopup from '~/Component/NewProjectPopup';
import search from '~/assets/images/search.png'
import ExportPopup from '~/Component/ExportPopup';
import { Link, useNavigate } from '@remix-run/react';
import Navbar from '~/Component/Navbar';
import Loading from '~/Component/Loading';
import { useAuth0 } from '@auth0/auth0-react';

interface Project {
    project_id: string;
    project_name: string;
    audio_link: string;
    date: string;
    status: {
        status: string;
        progress: number;
    };
}

const BACKEND_URL = 'http://127.0.0.1:8000';


const Dashboard = () => {
    
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth0()
    
    const [project, setProject] = React.useState<Project[]>([]);
    const [data, setData] = React.useState<Project[]>([]);
    const [newProject, setNewProject] = React.useState<boolean>(false);
    const [exportPopup, setExportPopup] = React.useState<boolean>(false);
    
    React.useEffect(() => { // check if user login or not and if login then get the project list
        if (user === undefined) {
            return;
        } else {
            const url = `${BACKEND_URL}/projects/${user?.email}`;
            const response = fetch(url, {
                method: "GET"
            }). then(response => response.json());

            response.then((projects: any) => { 
                Promise.all(projects.map(async (project: any) => {
                    const status = await fetch(`${BACKEND_URL}/projects/status/${user?.email}/${project.project_id}`, {
                        method: "GET"
                    }).then(response => response.json());
                    return {
                        ...project,
                        status: status || 'new'
                    };
                })).then(results => {
                    setData(results)
                    setProject(results);
                });
            });
        }
    }, [user])


    React.useEffect(() => { // to refresh the page to get updated status of everyproject which are not done
        if (project.length === 0) return;

        const hasIncompleteProject = project.some(
            (proj: any) => proj.status.status !== 'success'
        );

        if (!hasIncompleteProject) {
            return;
        }

        const interval = setInterval(() => {
            navigate(0);
        }, 15000);

        return () => clearInterval(interval);
    }, [project]);
    
    const handlechange = (event: any) => { // to change the project list base on the search input
        const value = (event.target.value)
        const filteredData = project.filter((data: any) => {
            console.log(value)
            console.log(data.project_name)
            if (data.project_name.includes(value)) {
                return data;
            }
        })
        console.log(filteredData)
        if (value === '') {
            setData(project)
        }
        else {
            setData(filteredData)
        }
    }


  return (
    <>
        <Navbar />
        <div className='pl-8 pr-8 pt-4 pb-4'>
            <h1 className=' text-2xl font-bold'>Projects</h1>
            <div className=' flex items-center mt-4'>
                <div className=' relative flex items-center border border-grey rounded-lg'>
                    <div className=' relative flex items-center p-2'>
                        <div className=' w-1/4'>
                            <img src={search} alt='search' className='w-4'/>
                        </div>
                        <div className=' ml-2'>
                            <input type='text' placeholder='Search' className=' w-56 focus:outline-none' onChange={() => handlechange(event)}/>
                        </div>
                    </div>
                </div>
                <div className=' transition-all duration-300 flex items-center border border-grey rounded-lg p-2 bg-green-600 text-white ml-10 cursor-pointer hover:opacity-85 active:opacity-70' onClick={() => setNewProject(true)}>
                    New Project 
                </div>
                {newProject ? <NewProjectPopup setPopup={setNewProject} /> : null}
            </div>
            <div>
                <div className=' mt-4 p-2 flex items-center'>
                    <div className=' w-2/4 font-bold text-xl'>
                        Name
                    </div>
                    <div className=' w-1/5 font-bold text-xl'>
                        Created On
                    </div>
                    <div className=' w-2/4 pl-4 pr-4 font-bold text-xl'>
                        Progress
                    </div>
                    <div className=' w-1/4 font-bold text-xl'>
                        Status
                    </div>
                    <div className=' w-1/4 font-bold text-xl'>
                        Export
                    </div>
                </div>
                {data.map((project: any, index: any) => (
                    <div key={index} className=' mt-4 p-2 flex justify-between items-center'>
                        <div className=' w-2/4'>
                            <Link to={`/Edit/${project.project_id}`} className=' text-blue-900 underline'>{project.project_name}</Link>
                        </div>
                        <div className=' w-1/5 '>
                            {project.date}
                        </div>
                        <div className=' w-2/4 pl-4 pr-4 font-bold'>
                            <div className=' flex items-center relative w-full bg-grey-200 rounded-lg'>
                                <div className=' bg-green-600 h-2 rounded-lg mr-2' style={{width: `${project.status.progress}%`}}></div>
                                <div>{project.status.progress}%</div>
                            </div>
                        </div>
                        <div className=' w-1/4 font-bold'>
                            {project.status.status}
                        </div>
                        <div className=' w-1/4'>
                            
                        <button 
                            onClick={() => {
                                {project.status.status === 'success' ? setExportPopup(() => true) : null}
                                }
                            }
                            disabled={project.status.status !== 'success'} 
                            className={`p-2 rounded-lg w-24 ${
                                project.status.status !== 'success' 
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' // disabled state
                                : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer' // enabled state
                            }`}
                        >Export</button>
                        {exportPopup ? <ExportPopup project_id={project.project_id} setPopup={setExportPopup} /> : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
  )
}

export default Dashboard
