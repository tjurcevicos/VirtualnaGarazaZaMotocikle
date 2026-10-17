
import { useEffect, useState } from 'react'
import { loadData, saveData } from '../utils/storageFacade'

function useGarageData(userId = null) {
  const [garageState, setGarageState] = useState(() => ({
    userId,
    vehicles: loadData('vehicles', userId),
    services: loadData('services', userId),
    fuelRecords: loadData('fuelRecords', userId),
    expenses: loadData('expenses', userId),
    reminders: loadData('reminders', userId),
    maintenancePlans: loadData('maintenancePlans', userId),
  }))

  const currentGarage =
    garageState.userId === userId
      ? garageState
      : {
          userId,
          vehicles: loadData('vehicles', userId),
          services: loadData('services', userId),
          fuelRecords: loadData('fuelRecords', userId),
          expenses: loadData('expenses', userId),
          reminders: loadData('reminders', userId),
          maintenancePlans: loadData('maintenancePlans', userId),
        }

  useEffect(() => {
    if (garageState.userId !== userId) {
      setGarageState({
        userId,
        vehicles: loadData('vehicles', userId),
        services: loadData('services', userId),
        fuelRecords: loadData('fuelRecords', userId),
        expenses: loadData('expenses', userId),
        reminders: loadData('reminders', userId),
        maintenancePlans: loadData('maintenancePlans', userId),
      })
    }
  }, [userId, garageState.userId])

  useEffect(() => {
    if (garageState.userId !== userId) {
      return
    }

    try {
      saveData('vehicles', garageState.vehicles, userId)
    } catch (error) {
      console.error('Spremanje motocikala nije uspjelo:', error)
    }
  }, [garageState.vehicles, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) {
      return
    }

    try {
      saveData('services', garageState.services, userId)
    } catch (error) {
      console.error('Spremanje servisa nije uspjelo:', error)
    }
  }, [garageState.services, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) {
      return
    }

    try {
      saveData('fuelRecords', garageState.fuelRecords, userId)
    } catch (error) {
      console.error('Spremanje goriva nije uspjelo:', error)
    }
  }, [garageState.fuelRecords, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) {
      return
    }

    try {
      saveData('expenses', garageState.expenses, userId)
    } catch (error) {
      console.error('Spremanje troškova nije uspjelo:', error)
    }
  }, [garageState.expenses, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) {
      return
    }

    try {
      saveData('reminders', garageState.reminders, userId)
    } catch (error) {
      console.error('Spremanje podsjetnika nije uspjelo:', error)
    }
  }, [garageState.reminders, garageState.userId, userId])

  useEffect(() => {
    if (garageState.userId !== userId) return
    try { saveData('maintenancePlans', garageState.maintenancePlans, userId) }
    catch (error) { console.error('Spremanje planova održavanja nije uspjelo:', error) }
  }, [garageState.maintenancePlans, garageState.userId, userId])

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
    reminders: currentGarage.reminders,
    setReminders: (value) => updateData('reminders', value),
  }
}

export default useGarageData