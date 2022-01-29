export const NavDirReducer = (state, action) => {
    switch (action.type) {
        case "ADD_PAGE":
            return {
                directory: [...state.directory, action.payload]
            }
        default:
            return initialState;
    }
};
