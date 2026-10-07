import { useEffect, useState } from 'react'
import './App.css'

import Sidebar from './components/Sidebar'

import Home from './pages/Home'
import Vozila from './pages/Vozila'
import DetaljiVozila from './pages/DetaljiVozila'
import Servisi from './pages/Servisi'
import Gorivo from './pages/Gorivo'
import Troskovi from './pages/Troskovi'
import Podsjetnici from './pages/Podsjetnici'

function App() {
  const [activePage, setActivePage] = useState('home')
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  const [vehicles, setVehicles] = useState(() => {
    const savedVehicles = localStorage.getItem('vehicles')

    return savedVehicles
      ? JSON.parse(savedVehicles)
      : []
  })

  const [services, setServices] = useState(() => {
    const savedServices = localStorage.getItem('services')

    return savedServices
      ? JSON.parse(savedServices)
      : []
  })

  const [fuelRecords, setFuelRecords] = useState(() => {
    const savedFuelRecords =
      localStorage.getItem('fuelRecords')

    return savedFuelRecords
      ? JSON.parse(savedFuelRecords)
      : []
  })

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses =
      localStorage.getItem('expenses')

    return savedExpenses
      ? JSON.parse(savedExpenses)
      : []
  })

  const [reminders, setReminders] = useState(() => {
    const savedReminders =
      localStorage.getItem('reminders')

    return savedReminders
      ? JSON.parse(savedReminders)
      : []
  })

  useEffect(() => {
    localStorage.setItem(
      'vehicles',
      JSON.stringify(vehicles),
    )
  }, [vehicles])

  useEffect(() => {
    localStorage.setItem(
      'services',
      JSON.stringify(services),
    )
  }, [services])

  useEffect(() => {
    localStorage.setItem(
      'fuelRecords',
      JSON.stringify(fuelRecords),
    )
  }, [fuelRecords])

  useEffect(() => {
    localStorage.setItem(
      'expenses',
      JSON.stringify(expenses),
    )
  }, [expenses])

  useEffect(() => {
    localStorage.setItem(
      'reminders',
      JSON.stringify(reminders),
    )
  }, [reminders])

  function handleNavigate(page) {
    setActivePage(page)
    setSelectedVehicle(null)
  }

  function handleSelectVehicle(vehicle) {
    setSelectedVehicle(vehicle)
  }

  function handleBackToVehicles() {
    setSelectedVehicle(null)
    setActivePage('vozila')
  }

  function handleAddVehicle(vehicle) {
    setVehicles((current) => [
      ...current,
      vehicle,
    ])
  }

  function handleDeleteVehicle(id) {
    setVehicles((current) =>
      current.filter((vehicle) => vehicle.id !== id),
    )

    setServices((current) =>
      current.filter((service) => service.vehicleId !== id),
    )

    setFuelRecords((current) =>
      current.filter((record) => record.vehicleId !== id),
    )

    setExpenses((current) =>
      current.filter((expense) => expense.vehicleId !== id),
    )

    setReminders((current) =>
      current.filter((reminder) => reminder.vehicleId !== id),
    )

    setSelectedVehicle(null)
  }

  function handleAddService(service) {
    setServices((current) => [
      ...current,
      service,
    ])
  }

  function handleDeleteService(id) {
    setServices((current) =>
      current.filter((service) => service.id !== id),
    )
  }

  function handleUpdateService(updatedService) {
    setServices((current) =>
      current.map((service) =>
        service.id === updatedService.id
          ? updatedService
          : service,
      ),
    )
  }

  function handleAddFuelRecord(record) {
    setFuelRecords((current) => [
      ...current,
      record,
    ])
  }

  function handleDeleteFuelRecord(id) {
    setFuelRecords((current) =>
      current.filter((record) => record.id !== id),
    )
  }

  function handleUpdateFuelRecord(updatedRecord) {
    setFuelRecords((current) =>
      current.map((record) =>
        record.id === updatedRecord.id
          ? updatedRecord
          : record,
      ),
    )
  }

  function handleAddExpense(expense) {
    setExpenses((current) => [
      ...current,
      expense,
    ])
  }

  function handleDeleteExpense(id) {
    setExpenses((current) =>
      current.filter((expense) => expense.id !== id),
    )
  }

  function handleUpdateExpense(updatedExpense) {
    setExpenses((current) =>
      current.map((expense) =>
        expense.id === updatedExpense.id
          ? updatedExpense
          : expense,
      ),
    )
  }

  function handleAddReminder(reminder) {
    setReminders((current) => [
      ...current,
      reminder,
    ])
  }

  function handleDeleteReminder(id) {
    setReminders((current) =>
      current.filter((reminder) => reminder.id !== id),
    )
  }

  function handleUpdateReminder(updatedReminder) {
    setReminders((current) =>
      current.map((reminder) =>
        reminder.id === updatedReminder.id
          ? updatedReminder
          : reminder,
      ),
    )
  }

  function renderPage() {
    if (activePage === 'vozila' && selectedVehicle) {
      return (
        <DetaljiVozila
          vehicle={selectedVehicle}
          services={services}
          onBack={handleBackToVehicles}
          onDelete={handleDeleteVehicle}
          onAddService={handleAddService}
          onDeleteService={handleDeleteService}
          onUpdateService={handleUpdateService}
        />
      )
    }

    switch (activePage) {
      case 'vozila':
        return (
          <Vozila
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onSelectVehicle={handleSelectVehicle}
          />
        )

      case 'servisi':
        return (
          <Servisi
            vehicles={vehicles}
            services={services}
            onAddService={handleAddService}
            onDeleteService={handleDeleteService}
            onUpdateService={handleUpdateService}
          />
        )

      case 'gorivo':
        return (
          <Gorivo
            vehicles={vehicles}
            fuelRecords={fuelRecords}
            onAddFuelRecord={handleAddFuelRecord}
            onDeleteFuelRecord={handleDeleteFuelRecord}
            onUpdateFuelRecord={handleUpdateFuelRecord}
          />
        )

      case 'troskovi':
        return (
          <Troskovi
            vehicles={vehicles}
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onUpdateExpense={handleUpdateExpense}
          />
        )

      case 'podsjetnici':
        return (
          <Podsjetnici
            vehicles={vehicles}
            reminders={reminders}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
            onUpdateReminder={handleUpdateReminder}
          />
        )

      case 'home':
      default:
        return (
          <Home
            vehicles={vehicles}
            services={services}
            fuelRecords={fuelRecords}
            expenses={expenses}
            reminders={reminders}
          />
        )
    }
  }

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App