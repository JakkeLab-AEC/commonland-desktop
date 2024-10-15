import React from "react"

interface ListBoxItemProps {
    id: string,
    displayText: string;
    onCheckedHandler?: (id: string, isChecked: boolean) => void;
    onClickItemHandler?: (id: string) => void;
}

export const ListBoxItem:React.FC<ListBoxItemProps> = ({id, displayText, onCheckedHandler, onClickItemHandler}) => {

    const onChekcedWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(onCheckedHandler) {
            onCheckedHandler(id, e.target.checked);
        }
    }

    const onClickWrapper = (e: React.MouseEvent<HTMLDivElement>) => {
        if(onClickItemHandler) {
            onClickItemHandler(id);
        }
    }
    
    
    return (
        <div className="flex flex-row gap-2 h-[32px] items-center">
            <div>
                <input 
                    type='checkbox'
                    onChange={onChekcedWrapper}/>
            </div>
            <div className="" onClick={onClickWrapper} style={{cursor: 'pointer'}}>
                {displayText}
            </div>
        </div>
    )
}
