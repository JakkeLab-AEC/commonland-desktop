import React from "react";
import { ListBoxItem } from "./listBoxItem";

interface ListBoxProps {
    height: number;
    items: Map<string, string>;
    header: string,
    maxLength?: number
    onClickHandler?: (id: string) => void,
    onCheckedHandler?: (id: string, checked: boolean) => void,
}

export const ListBox: React.FC<ListBoxProps> = ({height, items, header = "Header", onClickHandler, onCheckedHandler, maxLength = 16}) => {
    const convertedItems:{key: string, value: string}[] = [];
    if(items && items.size > 0) {
        items.forEach((value, key) => {
            convertedItems.push({key: key, value: value});
        })
    }

    const onClickWrapper = (id: string) => {
        if(onClickHandler) {
            onClickHandler(id);
        }
    }

    const listBoxStyle: React.CSSProperties = {
        borderTopWidth: 1, 
        borderTopColor: 'silver', 
        borderBottomWidth: 1, 
        borderBottomColor: 'silver', 
        height: height ? height : 300,
        overflowY:'scroll',
        userSelect:'none'
    }

    return (
        <div style={listBoxStyle}>
            <div>
                <ListBoxItem id={"header"} displayText={header} />
            </div>
            <hr />
            {convertedItems.map(item => {
                    return (
                    <ListBoxItem 
                        id={item.key} 
                        displayText={item.value.length > maxLength ? `${item.value.substring(0, maxLength - 1)}...` : item.value} 
                        onCheckedHandler={onCheckedHandler} 
                        onClickItemHandler={onClickWrapper} />)
                })}
        </div>
    )
}
