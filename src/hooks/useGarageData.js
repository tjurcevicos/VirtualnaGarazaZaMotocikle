
import { useEffect, useState } from 'react'
import { garageRepository } from '../services/garageRepository'

function useGarageData(userId = null) {
  const [garageState, setGarageState] = useState(() => ({
    userId,
    vehicles: garageRepository.load('vehicles', userId),
    services: garageRepository.load('services', userId),
    fuelRecords: garageRepository.load('fuelRecords', userId),
    expenses: garageRepository.load('expenses', userId),
    reminders: garageRepository.load('reminders', userId),
    maintenancePlans: garageRepository.load('maintenancePlans', userId),
    registrationRecords: garageRepository.load('registrationRecords', userId),
    trips: garageRepository.load('trips', userId),
    serviceParts: garageRepository.load('serviceParts', userId),
  }))

  const currentGarage =
    garageState.userId === userId
      ? garageState
      : {
          userId,
          vehicles: garageRepository.load('vehicles', userId),
          services: garageRepository.load('services', userId),
          fuelRecords: garageRepository.load('fuelRecords', userId),
          expenses: garageRepository.load('expenses', userId),
          reminders: garageRepository.load('reminders', userId),
          maintenancePlans: garageRepository.load('maintenancePlans', userId),
    registrationRecords: garageRepository.load('registrationRecords', userId),
    trips: garageRepository.load('trips', userId),
    serviceParts: garageRepository.load('serviceParts', userId),
        }

  useEffect(() => {
    if (garageState.userId !== userId) {
      setGarageState({
        userId,
        vehicles: garageRepository.load('vehicles', userId),
        services: garageRepository.load('services', userId),
        fuelRecords: garageRepository.load('fuelRecords', userId),
        expenses: garageRepository.load('expenses', userId),
        reminders: garageRepository.load('reminders', userId),
        maintenancePlans: garageRepository.load('maintenancePlans', userId),
    registrationRecords: garageRepository.load('registrationRecords', userId),
    trips: garageRepository.load('trips', userId),
    serviceParts: garageRepository.load('serviceParts', userId),
      })
    }
  }, [userId, garageState.userId])

  useEffect(() => {
    if (garageState.userId !== userId) {
      return
    }

    try {
      garageRepository.save('vehicles', garageState.vehicles, userId)
    } catch (error) {
      console.error('Spremanje motocikala nije uspjelo:', error)
    }
  }, [garageState.vehicles, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) {
      return
    }

    try {
      garageRepository.save('services', garageState.services, userId)
    } catch (error) {
      console.error('Spremanje servisa nije uspjelo:', error)
    }
  }, [garageState.services, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) {
      return
    }

    try {
      garageRepository.save('fuelRecords', garageState.fuelRecords, userId)
    } catch (error) {
      console.error('Spremanje goriva nije uspjelo:', error)
    }
  }, [garageState.fuelRecords, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) {
      return
    }

    try {
      garageRepository.save('expenses', garageState.expenses, userId)
    } catch (error) {
      console.error('Spremanje troškova nije uspjelo:', error)
    }
  }, [garageState.expenses, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) {
      return
    }

    try {
      garageRepository.save('reminders', garageState.reminders, userId)
    } catch (error) {
      console.error('Spremanje podsjetnika nije uspjelo:', error)
    }
  }, [garageState.reminders, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) return
    try { garageRepository.save('maintenancePlans', garageState.maintenancePlans, userId) }
    catch (error) { console.error('Spremanje planova održavanja nije uspjelo:', error) }
  }, [garageState.maintenancePlans, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) return
    try { garageRepository.save('registrationRecords', garageState.registrationRecords, userId) }
    catch (error) { console.error('Spremanje registracije nije uspjelo:', error) }
  }, [garageState.registrationRecords, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) return
    try { garageRepository.save('trips', garageState.trips, userId) }
    catch (error) { console.error('Spremanje putovanja nije uspjelo:', error) }
  }, [garageState.trips, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) return
    try { garageRepository.save('serviceParts', garageState.serviceParts, userId) }
    catch (error) { console.error('Spremanje dijelova nije uspjelo:', error) }
  }, [garageState.serviceParts, garageState.userId, userId])

  function updateData(key, value) {
    setGarageState((current) => {
      if (current.userId !== userId) {
        return current
      }

      const nextValue =
        typeof value === 'function'
          ? value(current[key])
          : value

      return {
        ...current,
        [key]: nextValue,
      }
    })
  }

  return {
    serviceParts: currentGarage.serviceParts,
    setServiceParts: (value) => updateData('serviceParts', value),
    vehicles: currentGarage.vehicles,
    setVehicles: (value) => updateData('vehicles', value),
    services: currentGarage.services,
    setServices: (value) => updateData('services', value),
    fuelRecords: currentGarage.fuelRecords,
    setFuelRecords: (value) => updateData('fuelRecords', value),
    expenses: currentGarage.expenses,
    setExpenses: (value) => updateData('expenses', value),
    maintenancePlans: currentGarage.maintenancePlans,
    setMaintenancePlans: (value) => updateData('maintenancePlans', value),
    trips: currentGarage.trips,
    setTrips: (value) => updateData('trips', value),
    registrationRecords: currentGarage.registrationRecords,
    setRegistrationRecords: (value) => updateData('registrationRecords', value),
    reminders: currentGarage.reminders,
    setReminders: (value) => updateData('reminders', value),
  }
}

export default useGarageData