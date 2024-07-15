export default (_maybeJson) => {
    try { JSON.parse(_maybeJson); return true } catch (e) { return false }
}
