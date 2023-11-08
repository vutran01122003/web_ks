function removeElem(arr, id) {
    const newArr = [...arr];

    for(let i = 0; i < arr.length; i++) {
        if( arr[i]._id === id) {
            newArr.splice(i, 1);
        }
    }
    
    return newArr;
}

export default removeElem;