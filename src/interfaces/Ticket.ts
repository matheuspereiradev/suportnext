export interface Interaction {
    id: string,
    text: string,
    file: string,
    idTicket: number,
    isPrivate: boolean,
    created_at: Date,
    sender: User
}

export interface Status {
    id: number,
    name: string,
    icon: string
}

export interface Company {
    id: number,
    name: string,
}

export interface Category {
    id: number,
    name: string,
}

export interface User {
    id: string,
    name: string,
    surname: string,
    email: string,
    gender: string
}

export interface Ticket {
    id: string,
    title: string,
    description: string,
    created_at: Date,
    requester: User
    status: Status,
    company: Company,
    category: Category,
    interactions: Interaction[]
}