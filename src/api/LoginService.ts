import axios from 'axios'

const http = axios.create({
    baseURL: process.env.VUE_APP_ELASTIC_HOST,
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
