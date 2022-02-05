import React from 'react';
import PropTypes from 'prop-types';
import LinkedButton from './button/LinkedButton';
import { useNavContext } from '../context/AppWrapper';

export default function NavDir(props) {
    const { directory, dispatch } = useNavContext();

    const popDir = (title) => {
        let currDirectory = [];
        for (let i = 0; i < directory.directory.length; i++) {
            if (directory.directory[i].title != title) {
                currDirectory.push(directory.directory[i]);
            } else if (directory.directory[i].title == title) {
                currDirectory.push(directory.directory[i]);
                break;
            }
        }
        dispatch({type: "POP_TO_CURR_PAGE", payload: currDirectory});
    }

    return (
        <div>
            {props.pages.directory.map((page) => {
                return (
                    <p>
                        <LinkedButton 
                            href={page.url}
                            name={page.title}
                            onClick={() => popDir(page.title, page.url)}
                        />
                        {">"}
                    </p>
                )
            })}
        </div>
    )
}

NavDir.propTypes = {
    pages: PropTypes.any
}