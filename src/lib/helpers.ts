// this function is used to generate sessionId
export function simpleUniqueId() {
    return `${Math.random().toString().substring(2)}.${Date.now()}`;
}
