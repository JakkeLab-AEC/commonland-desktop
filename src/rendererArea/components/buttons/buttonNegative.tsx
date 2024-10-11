import React from 'react'
import './buttonNegativeStyle.css'

export default function ButtonNegative({text, width, height, onClickHandler}:{text: string, width?: number|string, height?: number|string, onClickHandler?:(e:React.MouseEvent<HTMLButtonElement>) => void}) {
    const buttonHeight = !height ? 24 : height;

    return (
        <button id="btn-negative" onClick={onClickHandler} style={{width: width, borderRadius: 4, height: buttonHeight}}>
            {text}
        </button>
    )
}