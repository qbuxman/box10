export type LearnCategory = {
    id: number
    title: string
    description: string
    families: Family[]
    path?: string
    icon?: string
}

export type Family = {
    id: number
    label: string
    color?: string
}