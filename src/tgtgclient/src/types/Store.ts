export interface Store {
    id: string
    address_line: string
    c_at?: string
    city: string
    country: string
    cover_picture: CoverPicture
    location: number[]
    rating: number
    rating_count: number
    store_name: string
    u_at?: string
}

interface CoverPicture {
    current_url: string
    is_automatically_created: boolean
    picture_id: string
}