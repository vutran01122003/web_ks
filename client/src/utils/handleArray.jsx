export function removeElem(arr, id) {
    const newArr = [...arr];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i]._id === id) {
            newArr.splice(i, 1);
        }
    }

    return newArr;
}

export function replaceElem({ elemId, newElem, elemList }) {
    for (let i = elemList.length - 1; i >= 0; i--) {
        if (elemList[i]._id === elemId) {
            elemList[i] = newElem;
            break;
        }
    }

    return elemList;
}
