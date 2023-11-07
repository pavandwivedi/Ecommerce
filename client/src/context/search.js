import { useState,useContext,createContext} from "react";

const SearchContext = createContext();

const SearchProvider = ({children})=>{
    const [auth,setSearch] = useState({
       keyword:"",
       results:[],
    })

   
    return(
        <SearchContext.Provider value={[auth,setSearch]}>
            {children}
        </SearchContext.Provider>
    )
}


// custom hook
const useSearch =()=>useContext(SearchContext);
export {useSearch,SearchProvider}

