const BASE_URL = 'http://localhost:8000'

export async function api(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    })
    return response.json()
}