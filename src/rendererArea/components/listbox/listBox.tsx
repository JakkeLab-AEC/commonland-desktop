import React from "react";
import { ListBoxItem } from "./listBoxItem";

interface ListBoxProps {
    height: number;
    items: Map<string, string>;
    header: string,
    onClickHandler?: (id: string) => void,
}

export const ListBox: React.FC<ListBoxProps> = ({height, items, header = "Header", onClickHandler}) => {
    const convertedItems:{key: string, value: string}[] = [];
    if(items && items.size > 0) {
        items.forEach((value, key) => {
            convertedItems.push({key: key, value: value});
        })
    }

    const onCheckedHandler = (id: string, checked: boolean) => {
        console.log(`${id} : ${checked ? 'checked': 'unchecked'}`);
    }

    const onClickWrapper = (id: string) => {
        if(onClickHandler) {
            onClickHandler(id);
        }
    }
    
    const ListBoxItems = () => {
        return (
            <div>
                {convertedItems.map(item => {
                    return (<ListBoxItem id={item.key} displayText={item.value} onCheckedHandler={onCheckedHandler} onClickItemHandler={onClickWrapper} />)
                })}
            </div>
        )
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
            <div>
                <ListBoxItems />
            </div>
        </div>
    )
}
