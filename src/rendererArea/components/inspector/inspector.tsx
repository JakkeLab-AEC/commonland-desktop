import React, { ReactNode } from "react";
import './inspectorStyles.css';

interface InspectorProps {
    title: string,
    children?: ReactNode
    width: number,
    height: number,
    onClickCloseHandler?: () => void;
}

export const Inspector:React.FC<InspectorProps> = ({children, onClickCloseHandler, title = 'Default Inspector', width = 120, height = 160}) => {
    const onClickWrapper = () => {
        if(onClickCloseHandler) {
            onClickCloseHandler();
        }
    }
    
    return (
        <div style={{borderRadius: 8, width: width, height: height, backgroundColor:'white', userSelect: 'none'}} className="flex flex-col inspector-body">
            {/* Header */}
            <div className="flex flex-row p-2">
                <div className="flex-grow">
                    {title}
                </div>
                <div className="icon-close" onClick={onClickWrapper} style={{cursor: 'pointer'}}>
                    <svg viewBox="0 0 20 20" style={{}}>
                        <path d="M6 6 L14 14 M14 6 L6 14" />
                    </svg>
                </div>
            </div>
            <hr />
            <div className="h-full">
                {children}
            </div>
        </div>
    )
}
