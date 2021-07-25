import axios from 'axios'

const http = axios.create({
    baseURL: `http://localhost:5000`,
    headers: { 'Content-Type': 'application/json' }
})

export async function login(itemId: string): Promise<Object> {
    const response = await http.get(`/${itemId}`)
    return response.data
}

export async function logout(item: Object): Promise<Object> {
    const response = await http.post('/', JSON.stringify(item))
    return response.data
}
