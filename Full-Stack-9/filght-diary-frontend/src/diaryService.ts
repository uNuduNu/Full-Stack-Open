import axios from 'axios'
import { NonSensitiveDiaryEntry, PostDiaryEntry } from './types'

const baseUrl = 'http://localhost:3000/api/diaries'

export const getAllEntries = () => {
    return axios
        .get<NonSensitiveDiaryEntry[]>(baseUrl)
        .then(response => response.data)
}

export const createEntry = (object: PostDiaryEntry) => {
    return axios
        .post<PostDiaryEntry>(baseUrl, object)
        .then(response => response.data)
}