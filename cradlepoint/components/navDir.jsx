import React from 'react';
import PropTypes from 'prop-types';
import LinkedButton from './button/LinkedButton';

export default function NavDir(props) {
    return (
        <div>
            {console.log(props.pages.directory)}
            {props.pages.directory.map((page) => {
                return (
                    <p><LinkedButton href={page.url} name={page.title}/>{">"}</p>
                )
            })}
        </div>
    )
}

NavDir.propTypes = {
    pages: PropTypes.any
}