import React, { memo, useEffect, useState } from 'react'

const Counter = () => {
    const [count, setCount] = useState(52)
    const [one, setOne] = useState(0)
    const [search, setSearch] = useState("")
    useEffect(() => {
        return () => setCount(prev => prev + 1)
    }, [])
    return (
        <>
            <input type="text" value={ search } onChange={ (e) => setSearch(e.target.value) } placeholder='Anything' className='border w-full border-black py-4 px-4' />
            <p>For rendering the Parent { one }</p>
            <Count count={ count } />
            <WithoutCount count={ count } />
            <button className='block text-xl' onClick={ () => setOne((prev) => prev + 1) }>Render the Parent</button>
            <button className='block text-xl' onClick={ () => setCount((prev) => prev + 1) }>Increase</button>
        </>
    )
}

const Count = memo(({ count }) => {
    // console.log("I am memo", count)
    return <div className='text-2xl'>{ count }</div>
})

const WithoutCount = ({ count }) => {
    // console.log("I am without memo", count)
    return <div className='text-2xl'>{ count }</div>
}


export default Counter