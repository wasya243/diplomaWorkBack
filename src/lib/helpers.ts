export function simpleUniqueId() {
    return `${Math.random().toString().substring(2)}.${Date.now()}`;
}
