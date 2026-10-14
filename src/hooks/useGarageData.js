
import { useEffect, useState } from 'react'
import { loadData, saveData } from '../utils/storageFacade'

function useGarageData() {
  const [vehicles, setVehicles] = useState(() =>
    loadData('vehicles'),
  )

  const [services, setServices] = useState(() =>
    loadData('services'),
  )

  const [fuelRecords, setFuelRecords] = useState(() =>
    loadData('fuelRecords'),
  )

  const [expenses, setExpenses] = useState(() =>
    loadData('expenses'),
  )

  const [reminders, setReminders] = useState(() =>
    loadData('reminders'),
  )

  useEffect(() => {
    try {
      saveData('vehicles', vehicles)
    } catch (error) {
      console.error('Spremanje motocikala nije uspjelo:', error)
    }
  }, [vehicles])

  useEffect(() => {
    try {
      saveData('services', services)
    } catch (error) {
      console.error('Spremanje servisa nije uspjelo:', error)
    }
  }, [services])

  useEffect(() => {
    try {
      saveData('fuelRecords', fuelRecords)
    } catch (error) {
      console.error('Spremanje goriva nije uspjelo:', error)
    }
  }, [fuelRecords])

  useEffect(() => {
    try {
      saveData('expenses', expenses)
    } catch (error) {
      console.error('Spremanje troškova nije uspjelo:', error)
    }
  }, [expenses])

  useEffect(() => {
    try {
      saveData('reminders', reminders)
    } catch (error) {
      console.error('Spremanje podsjetnika nije uspjelo:', error)
    }
  }, [reminders])

  return {
    vehicles,
    setVehicles,
    services,
    setServices,
    fuelRecords,
    setFuelRecords,
    expenses,
    setExpenses,
    reminders,
    setReminders,
  }
}

export default useGarageData