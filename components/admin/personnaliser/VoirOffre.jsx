'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const VoirOffre = () => {
    const { id } = useSearchParams()
    const [data, setData] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/offres/${id}`)
                const data = await response.json()
                // data.classement = data.classement ? JSON.parse(data.classement) : [];
                // data.descriptionOC = data.descriptionOC ? JSON.parse(data.descriptionOC) : [];
                // setData(data)
                console.log(data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])

    return (
        <div className='text-black'>
            {/* {data.content} */}
        </div>
    )
}

export default VoirOffre