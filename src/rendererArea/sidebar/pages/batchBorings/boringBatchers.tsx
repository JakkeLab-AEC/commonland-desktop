import { useEffect, useState } from "react"
import { ListBox } from "../../../../rendererArea/components/listbox/listBox"
import { useBoringBatcherStore } from "./boringBatcherStore";
import { ButtonPositive } from "../../../../rendererArea/components/buttons/buttonPositive";
import { ButtonNegative } from "../../../../rendererArea/components/buttons/buttonNegative";

export const BoringBatcher = () => {
    const [checkedBatchedItems, setCheckedBatchedItems] = useState<Set<string>>(new Set());
    const [checkedUnbatchedItems, setCheckedUnbatchedItems] = useState<Set<string>>(new Set());

    const {
        batchedBorings,
        unbatchedBorings,
        bacthedBoringDisplayItems,
        unbacthedBoringDisplayItems,
        batchBorings,
        unbatchBorings,
        fetchAllBorings,
        updateBatchedBoringDisplayItem,
        updateUnbatchedBoringDisplayItem
    } = useBoringBatcherStore();
    
    const onCheckedItemFromBatchedHandler = (id: string, checked: boolean, all?: boolean) => {
        if(all != null) {
            if(all) {
                const ids = new Set(batchedBorings.keys().toArray());
                ids.forEach(id => updateBatchedBoringDisplayItem(id, true));
                setCheckedBatchedItems(ids);
            } else {
                const ids = new Set(batchedBorings.keys().toArray());
                ids.forEach(id => updateBatchedBoringDisplayItem(id, false));
                setCheckedBatchedItems(new Set());
            }
        } else {
            const newSet = new Set(checkedBatchedItems);
            if(checked) {
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            setCheckedBatchedItems(newSet);
            updateBatchedBoringDisplayItem(id, checked);
        }
        console.log(checkedBatchedItems);
    }

    const onCheckedItemFromUnbatchedHandler = (id: string, checked: boolean, all?: boolean) => {
        if(all != null) {
            if(all) {
                const ids = new Set(unbatchedBorings.keys().toArray());
                ids.forEach(id => updateUnbatchedBoringDisplayItem(id, true));
                setCheckedUnbatchedItems(ids);
            } else {
                const ids = new Set(unbatchedBorings.keys().toArray());
                ids.forEach(id => updateUnbatchedBoringDisplayItem(id, false));
                setCheckedUnbatchedItems(new Set());
            }
        } else {
            const newSet = new Set(checkedUnbatchedItems);
            if(checked) {
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            setCheckedUnbatchedItems(newSet);
            updateUnbatchedBoringDisplayItem(id, checked);
        }
        console.log(checkedUnbatchedItems);
    }

    const unbatchBoringsWrapper = async () => {
        unbatchBorings(checkedBatchedItems.values().toArray());
        setCheckedBatchedItems(new Set());
    }

    const batchBoringsWrapper = async () => {
        batchBorings(checkedUnbatchedItems.values().toArray());
        setCheckedUnbatchedItems(new Set());
    }

    useEffect(() => {
        fetchAllBorings();
    }, []);

    return (
        <div className="flex flex-col gap-2">
            <div>
                배치된 시추공
            </div>
            <ListBox height={300} items={bacthedBoringDisplayItems} header={"이름"} onCheckedHandler={onCheckedItemFromBatchedHandler}/>
            <div className="flex flex-row place-content-between">
                <ButtonPositive text={"▲ 배치하기"} isEnabled={true} width={120} onClickHandler={batchBoringsWrapper}/>
                <ButtonNegative text={"▼ 보관하기"} isEnabled={true} width={120} onClickHandler={unbatchBoringsWrapper}/>
            </div>
            <div>
                보관된 시추공
            </div>
            <ListBox height={300} items={unbacthedBoringDisplayItems} header={"이름"} onCheckedHandler={onCheckedItemFromUnbatchedHandler}/>
            <div className="flex flex-row gap-2">
                <ButtonPositive text={"지형 생성"} isEnabled={true} width={72} />
            </div>
        </div>
    )
}
