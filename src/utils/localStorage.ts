export function setItem(name: string, value: any) {
    localStorage.setItem(name, JSON.stringify(value));
}

export function getItem(name: string) {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
}
