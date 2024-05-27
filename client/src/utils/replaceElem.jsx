function replaceElem({ elemId, newElem, elemList }) {
    for (let i = elemList.length - 1; i >= 0; i--) {
        if (elemList[i]._id === elemId) {
            elemList[i] = newElem;
            break;
        }
    }

    return elemList;
}

export default replaceElem;
