'use client';
import React from 'react'

const Title = ({ id }) => {
    return (
        <div className='mt-20 space-y-10 px-5'>
            <div className="flex justify-around">
                <p className=''>“Very intuitive and easy to use.”</p>
                <p className='sm:block hidden'>“Very intuitive and easy to use.”</p>
                <p className='md:block hidden'>“Very intuitive and easy to use.”</p>
            </div>
            <div className="flex justify-center text-center">
                <h1 className="w-[600px] md:text-[50px] sm:text-[40px] text-[30px] font-bold">Generate Original AI Content, <span className='bg-blue-700 text-white rounded-md px-3 py-1'>Fast!</span></h1>
            </div>
            <div className="flex justify-center text-center">
                <p className='w-[600px] text-xl'>Generating content fast is cool but generating original content fast is cooler.</p>
            </div>
            <div className="flex justify-around text-center md:text-xl text-md">
                <div id={id} className="w-[500px] flex justify-around">
                    <button className='md:p-3 p-2 border-black border-[1px] rounded-lg'>Start with Google</button>
                    <button className='md:p-3 p-2 border-none bg-blue-700 rounded-lg text-white font-sans'>Start with Email</button>
                </div>
            </div>
        </div>
    )
}

export default Title