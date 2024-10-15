import React from 'react';
import './buttonPositiveStyle.css';

export default function ButtonPositive({text, width, height, onClickHandler}:{text: string, width?: number|string, height?: number|string, onClickHandler?:(e:React.MouseEvent<HTMLButtonElement>) => void}) {
    const buttonHeight = !height ? 24 : height;
    
    return (
        <button id="btn-positive" onClick={onClickHandler} style={{width: width, borderRadius: 4, height: buttonHeight}}>
            {text}
        </button>
    )
}