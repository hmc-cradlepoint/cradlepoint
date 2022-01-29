import { useReducer } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';

export const NavContext = createContext();

export function AppWrapper({children}) {
    const initialState = {directory: [{title: "Home", url: "/2home"}]};
    
    const NavDirReducer = (state, action) => {
        switch (action.type) {
            case "ADD_PAGE":
                return {
                    directory: [...state.directory, action.payload]
                }
            default:
                return initialState;
        }
    };

    const [directory, dispatch] = useReducer(NavDirReducer, initialState);

    return(
        <NavContext.Provider value={{ directory, dispatch }}>
            {children}
        </NavContext.Provider>
    )

}

export function useNavContext() {
    return useContext(NavContext);
}