'use client'

const Caracteristiques = ({ data, params, classements }) => {

    return (
        <div className='rounded-lg p-5 bg-white mt-8  '>

            <div className='rounded-lg bg-gray-200 m-5'>
                <div className="border-[30] rounded-lg place-items-center ">
                    <p className='text-black p-1'>Primary task</p>
                    <button className='border-[30] bg-gray-100 rounded-lg text-black px-5 py-1'>voice changing</button>
                </div>
                <div className='rounded-b-lg bg-gray-300 place-items-center mt-2'>
                    <p className='text-white p-1'>*un most recent</p>
                </div>
            </div>
            <div className='flex flex-wrap m-3 gap-4 items-center'>
                {
                    data.classement.map((item, index) =>
                        <a href={navigation(item, classements, params)} key={index} className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300'>{item} </a>
                    )
                }
                <p className='bg-yellow-400 text-red-400 font-bold text-3xl p-1'>from ${data.prix}/mois</p>
            </div>
            <p className='p-4 text-[15px]'>Most popular alternative:  <span className='font-bold'> MetaVoice Studio  </span> (321 saves)</p>
            <div className=''>
                <button onClick={() => alert("alternative")} className='flex bg-gray-100 rounded-lg  px-3 py-2 m-2 text-[15px] w-full'> View all 9alternatives</button>
                <button className='flex bg-gray-100 rounded-lg px-3 py-2 m-2 text-[15px] w-full'> recommendation </button>
            </div>

        </div>

    )
}

export default Caracteristiques

// Fonction pour défiler vers une section
export const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
};

const navigation = (pageName, classements, params) => {
    let out = '';
    classements.forEach((element) => {
        element.classement.forEach((ele) => {
            if (ele.title === pageName) {
                out = element.title;
            }
        });
    });
    return "/" + params + "/" + out.toLowerCase() + "/" + pageName.toLowerCase();
};