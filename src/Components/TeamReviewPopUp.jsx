import React from 'react'
import alertIcon from '../assets/alertIcon.png'


export default function TeamReviewPopUp({alertTitle,alertMessage}) {
    return (
        
            <div className="bg-black w-[24rem] px-2 rounded-md h-[7rem] flex flex-col items-center justify-center absolute left-[17rem] top-[10rem]">
            <div className='flex items-center justify-center space-x-3'>
            <img src={alertIcon} className='h-6 w-6 ' />
            <h1 style={{fontFamily:'serif'}} className="text-white text-lg font-bold text-center">{alertTitle}</h1> 
            </div>
               
                <p style={{fontFamily:'monospace'}} className="text-white ml-5 text-md text-center">{alertMessage}</p> 
            </div>
        
    )
}
