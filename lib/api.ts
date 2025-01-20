import axios, { AxiosRequestConfig } from 'axios'
import { API_KEY, BASE_URL, IMAGE_BASE_URL } from '@/constants'

interface AxiosConfig {
  url: string
  /**
   * @default get
   */
  method?: string
  /**
   * @default { api_key: API_KEY, ...params }
   */
  params?: { [x: string]: any }
}

const axiosConfig = ({ url, method, params }: AxiosConfig): AxiosRequestConfig => {
  return {
    url: `${BASE_URL}${url}`,
    method: method ?? 'get',
    params: { api_key: API_KEY, ...params },
  }
}

export const trendingMovies = async () => {
  try {
    // const { data } = await axios.get(`${BASE_URL}trending/movie/day?api_key=${API_KEY}`)
    const { data } = await axios.request(axiosConfig({ url: 'trending/movie/day' }))

    return data.results
  } catch (error) {
    console.log(error)
  }
}

export const topRatedMovies = async () => {
  try {
    // const { data } = await axios.get(`${BASE_URL}movie/top_rated?api_key=${API_KEY}&language=en-US`)
    const { data } = await axios.request(
      axiosConfig({ url: 'movie/top_rated', params: { language: 'en-US' } })
    )

    return data.results
  } catch (error) {
    console.log(error)
  }
}

export const popularMovies = async () => {
  try {
    // const { data } = await axios.get(`${BASE_URL}movie/popular?api_key=${API_KEY}&language=en-US`)
    const { data } = await axios.request(
      axiosConfig({ url: 'movie/popular', params: { language: 'en-US' } })
    )

    return data.results
  } catch (error) {
    console.log(error)
  }
}

export const genreMovies = async (type: string, id: number) => {
  try {
    const { data } = await axios.request(
      axiosConfig({
        url: `discover/${type}`,
        params: {
          language: 'en-US',
          with_genres: id,
          include_adult: false,
          sort_by: 'popularity.desc',
        },
      })
    )

    return data.results
  } catch (error) {
    console.log(error)
  }
}

export const searchMovies = async (params: { query: string }) => {
  try {
    const { data } = await axios.request(
      axiosConfig({
        url: 'search/movie',
        params: { language: 'en-US', page: 1, include_adult: false, ...params },
      })
    )

    return data.results
  } catch (error) {
    console.log()
  }
}

export const movieDetails = async (id: string, type: 'movie' | 'tv') => {
  try {
    const { data } = await axios.request(axiosConfig({ url: `${type}/${id}` }))

    return data
  } catch (error) {
    console.log(error)
  }
}

export const movieCredits = async (id: string, type: 'movie' | 'tv') => {
  try {
    const { data } = await axios.request(axiosConfig({ url: `${type}/${id}/credits` }))

    return data.cast
  } catch (error) {
    console.log(error)
  }
}

export const similarMovies = async (id: string, type: 'movie' | 'tv') => {
  try {
    const { data } = await axios.request(axiosConfig({ url: `${type}/${id}/similar` }))

    return data.results
  } catch (error) {
    console.log(error)
  }
}

// image
export const imageOriginal = (path: string) => {
  return `${IMAGE_BASE_URL}original${path}`
}

export const image185 = (path?: string) => {
  return `${IMAGE_BASE_URL}w185${path}`
}

export const image500 = (path?: string) => {
  return `${IMAGE_BASE_URL}w500${path}`
}
