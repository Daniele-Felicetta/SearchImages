import React from 'react';
import '../styles/style.scss';
import {useState,useRef, useEffect} from 'react';

const apiPexels:string= "WllkzMLGY3b6Y45ZEt5e445cuCyjiWeidmmj5G2qWmn2pPvraa3KEbqK";

export default function SearchImage(){
    const inputRef= useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<string[]>([]);
    const [page, setPage] = useState<number>(1);
    const [more, setMore] =useState<boolean>(false);
    const [firstEmpty, setFirstEmpty] = useState<boolean>(false);
    const [noMore, setNoMore] = useState<boolean>(false);
    const [urlPexels,setUrlPexels] = useState<string[]>([]);
    const [failedFetch,setFailedFetch] = useState<boolean>(false);
async function search (page:number){
        const request= inputRef.current?.value;

        if(request!== ""){
            try{
                const data=await fetch(`https://api.pexels.com/v1/search?query=${request}&per_page=50&page=${page}`, 
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: apiPexels,         
                    },
                }
                );
                const response=await data.json();     
                console.log(response);  
                setFailedFetch(false);
                displayImages(response);
            }
            catch(error){
                setFailedFetch(true);
                console.log(error);
            }
        }
        
    }
    function changePage(){
        setPage(page+1);
    }
    useEffect(()=>{
        console.log("changePage");
        search(page);
    },[page,failedFetch]);

    function displayImages(response:any){
        setNoMore(false);
        if(more==true){
            const imageArray = [...images,...response.photos.map((image: any) =>  image.src.large)];
            setImages(imageArray);
            const url =[...urlPexels,...response.photos.map((image: any) =>  image.url)];
            setUrlPexels(url); 

            if(response.photos.length<1){
                setNoMore(true);
            }

        }
        else{
            const imageArray = response.photos.map((image: any) => image.src.large);
            setImages(imageArray);
            setPage(1);
            const url =[...response.photos.map((image: any) =>  image.url)];
            setUrlPexels(url);
        }
        setFirstEmpty(true);
        setMore(false);
    }
    function moreImages(){
        setMore(true);
        changePage();
    }
    
    function fetchHandler(){
        console.log(inputRef);
        search(page);
    }       
    function fetchKey(event:any){
        if(event.key=="Enter"){
            console.log(inputRef);
            search(page);
        }
    }
    console.log(urlPexels);
    
    return (
        <div className="container">
        <h1 style={{textAlign:"center"}}>Search for Images</h1>
            <div className='flex-container'>
                <input onKeyDown={fetchKey} type="text" className="search" placeholder="Search for Images🔎" ref={inputRef}/>
                <button onClick={fetchHandler} className="search_btn">Search</button>
            </div>
            { images.length > 0 &&(
                <div style={{textAlign:"center"}}>
                    <h1>Your search keyword is: {inputRef.current?.value}</h1>
                    <div className='photo-grid'>
                        {images.map((imageUrl:string, index:number) => (
                            <div>        
                                <a target="_blank" rel="noreferrer noopener" href={urlPexels[index]}><img key={index} src={imageUrl} alt={`Image ${index + 1} `} /></a>
                            </div>
                        ))}
                    </div>
                    {noMore && <h1>No more images to load</h1>}           
                    {noMore==false && <button className="more-images" onClick={moreImages}>More images </button>}
                </div>
               )
            }
            {firstEmpty  && images.length == 0 ? <h2 style={{textAlign:"center",marginTop:"100px"}}>There aren't image with this keyword</h2> : ""}
            {failedFetch && <h2 style={{textAlign:"center",color:"red", marginTop:"100px"}}>Fatal Error: fail to fetching images</h2>}
        
        </div>
    )
}