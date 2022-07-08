export function StoreSettings(data) {
    return {
        type: 'STORE',
        payload: data
    }
}

export function UpdateSettings(data) {
    return {
        type: 'UPDATE',
        payload: data
    }
}