import React from 'react'

type DropDownProps = {
    data: string[];
    select: React.Dispatch<React.SetStateAction<string>>;
    dropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropDown = ({data, select, dropdown}: DropDownProps) => {
  return (
    <div className=' border border-gray-300 rounded absolute bg-white w-3/4 z-50'>
        {data.map((item, index) => (
            <div key={index} className=' pl-2 pt-2 hover:bg-gray-200 cursor-pointer' onClick={() => {select(item); dropdown(false)}}>    
                {item}
            </div>
        ))}
    </div>
  )
}

export default DropDown
