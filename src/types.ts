export type Status = 'to-read' | 'reading' | 'finished'

export const STATUSES: Status[] = ['to-read', 'reading', 'finished']

export interface Book {
  id: string
  title: string
  author: string
  totalPages: number
  pagesRead: number
  status: Status
}
