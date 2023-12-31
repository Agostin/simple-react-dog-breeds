import { useState, useEffect } from 'react'
import { ImageDetailModal } from './components/ImageDetailModal'

import './App.css'
import { breedKeyToString, parseBreeds } from './utils/functions'

const App = () => {
  const [breeds, setBreeds] = useState<string[]>([])
  const [filteredBreeds, setFilteredBreeds] = useState<string[]>([])
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null)
  const [selectedBreedImg, setSelectedBreedImg] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  const DOG_CEO_API_ENDPOINT = 'https://dog.ceo/api';

  const fetchDogsBreeds = async () => {
    try {
      const response = await fetch(`${DOG_CEO_API_ENDPOINT}/breeds/list/all`)
      const data = await response.json()

      if (response.status === 200 && data.status === 'success') {
        const list = parseBreeds(data.message)
        setBreeds(list)
        setFilteredBreeds(list)
      } else {
        setError(data.message)
        setBreeds([])
        setFilteredBreeds([])
      }
    } catch (error) {
      setError('Oops! Something went wrong while loading dogs breeds')
      setBreeds([])
      setFilteredBreeds([])
    }
  }

  const showRandomBreedImage = async (breed: string) => {
    setIsLoading(true)

    try {
      const response = await fetch(`${DOG_CEO_API_ENDPOINT}/breed/${breed}/images/random`)
      const data = await response.json()
      
      if (response.status === 200 && data.status === 'success') {
        setSelectedBreedImg(data.message)
        setSelectedBreed(breedKeyToString(breed))
      } else {
        setError(data.message)
        setSelectedBreedImg('')
        setSelectedBreed(null)
      }
      setIsLoading(false)
    } catch (error) {
      setError('Oops! Something went wrong...')
      setIsLoading(false)
      setSelectedBreedImg('')
      setSelectedBreed(null)
    }
  }

  const filterResults = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    if (term.length > 2) {
      setFilteredBreeds(breeds.filter((b: string) => b.indexOf(term) !== -1))
    } else {
      setFilteredBreeds(breeds)
    }
  }
  
  useEffect(() => {
    fetchDogsBreeds()
  }, [])
  
  return (
    <div className='flex items-center justify-center m-auto h-full min-h-screen bg-gray-200'>
      <div className='container m-auto px-4 py-10 lg:max-w-5xl'>
        <div className='flex flex-col items-center justify-between sm:flex-row'>
          <h1 className='flex items-center text-3xl w-full'>🐶 Dogs List 🐾</h1>
          <input className='rounded-md shadow-sm border border-gray-300 outline-none px-3 py-1 w-full h-10 mt-2 mb-4 sm:max-w-xs sm:m-0' type="search" placeholder='Search for a dog breed...' onChange={filterResults} />
        </div>
        
        {
          error ? <p data-testid="error-wrapper">{error}</p> :
          filteredBreeds.length ? 
            <ul className='mt-6 shadow-sm border-gray-300 bg-white py-4 px-8 rounded-xl'>
              {filteredBreeds?.map(breed =>
                <li
                  data-testid="dogs-breed-wrapper"
                  key={breed} onClick={()=> showRandomBreedImage(breed)}
                  className='py-3 border-b border-b-gray-300 text-xl cursor-pointer transition-colors duration-300 hover:text-cyan-500 last:border-b-0'>
                  {breedKeyToString(breed)}
                </li>
              )}
            </ul> :
            <h3>No matching breed found with the typed term. Please retry!</h3> 
        }
        
        {<ImageDetailModal imageUrl={selectedBreedImg} imageAlt={`A picture of a ${selectedBreed || ''} dog`} isLoading={isLoading} />}
      </div>
    </div>
  )
}

export default App
