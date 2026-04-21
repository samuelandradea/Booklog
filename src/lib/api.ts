const BASE_URL = process.env.EXPO_PUBLIC_API_URL

export async function api(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    })
    return response.json()
}