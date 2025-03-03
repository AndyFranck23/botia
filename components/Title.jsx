'use client';
import React from 'react'

const Title = ({ params }) => {

    return (
        <>
            <div className='mt-10 space-y-10 px-5 mx-5 md:m-x-10 '>
                <div className="flex justify-center text-center">
                    <h1 className="w-full md:text-[50px] sm:text-[40px] text-[30px] font-bold">{params?.titre_h1 ? params?.titre_h1 : params?.title} </h1>
                </div>
                <div className="flex justify-center text-center">
                    <p className='w-full text-xl'>{params?.text} </p>
                </div>
            </div>
        </>
    )
}

export default Title