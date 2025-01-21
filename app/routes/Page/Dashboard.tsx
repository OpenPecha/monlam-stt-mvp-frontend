import React from 'react'
import NewProjectPopup from '../../Component/NewProjectPopup';
import search from '../../assets/images/search.png'

const Dashboard = () => {

    const [data, setData] = React.useState([
        {
            id: 1,
            name: 'Project 1',
            status: 'Started',
            process: '50%',
            created_on: '2021-09-01',
        },
        {
            id: 2,
            name: 'Project 2',
            status: 'Started',
            process: '20%',
            created_on: '2021-09-01',
        },
        {
            id: 3,
            name: 'Project 3',
            status: 'Failed',
            process: '0%',
            created_on: '2021-09-01',
        },
        {
            id: 4,
            name: 'Project 4',
            status: 'Finished',
            process: '100%',
            created_on: '2021-09-01',
        },
    ])

    const [projects, setProjects] = React.useState([...data]);

    const [newProject, setNewProject] = React.useState<boolean>(false);

    const handlechange = (event: any) => {
        const value = (event.target.value)
        const filteredData = data.filter((project) => project.name.toLowerCase().includes(value))
        setProjects(filteredData)
    }


  return (
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
            <div className=' flex items-center border border-grey rounded-lg p-2 bg-green-600 text-white ml-10 cursor-pointer' onClick={() => setNewProject(true)}>
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
            {projects.map((project, index) => (
                <div key={index} className=' mt-4 p-2 flex justify-between items-center'>
                    <div className=' w-2/4'>
                        {project.name}
                    </div>
                    <div className=' w-1/5 '>
                        {project.created_on}
                    </div>
                    <div className=' w-2/4 pl-4 pr-4'>
                        <div className=' flex items-center relative w-full bg-grey-200 rounded-lg'>
                            <div className=' bg-green-600 h-2 rounded-lg mr-2' style={{width: project.process}}></div>
                            <div>{project.process}</div>
                        </div>
                    </div>
                    <div className=' w-1/4'>
                        {project.status}
                    </div>
                    <div className=' w-1/4'>
                        
                    <button 
                        disabled={project.status === 'Finished'} 
                        className={`p-2 rounded-lg w-24 ${
                            project.status !== 'Finished' 
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' // disabled state
                            : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer' // enabled state
                        }`}
                    >Export</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Dashboard
