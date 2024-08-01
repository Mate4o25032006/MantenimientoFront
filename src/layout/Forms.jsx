import React from 'react'

export const Forms = ({ children }) => {
    return (
        <section className='max-w-[75%] md:max-w-[90%] h-[50%] w-[65%] mx-auto mt-24 md:mt-28 lg:mt-28 border border-neutral-400/40 m-4 p-6 shadow-lg shadow-[#1565c023] rounded-lg'>
            {children}
        </section>
    )
}
