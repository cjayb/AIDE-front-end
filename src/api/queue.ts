import axios from 'axios'

const http = axios.create({
    baseURL: `base-url`,
    headers: { 'Content-Type': 'application/json' }
})

export async function getItemById(itemId: string): Promise<Object> {
    const response = await http.get(`/${itemId}`)
    return response.data
}

export async function createItem(item: Object): Promise<Object> {
    const response = await http.post('/', JSON.stringify(item))
    return response.data
}
