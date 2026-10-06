import { useState } from 'react'
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

  const [vehicles, setVehicles] = useState([])
  const [services, setServices] = useState([])
  const [fuelRecords, setFuelRecords] = useState([])

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
        return <Servisi />

      case 'gorivo':
        return (
          <Gorivo
            vehicles={vehicles}
            fuelRecords={fuelRecords}
            onAddFuelRecord={handleAddFuelRecord}
            onDeleteFuelRecord={handleDeleteFuelRecord}
          />
        )

      case 'troskovi':
        return <Troskovi />

      case 'podsjetnici':
        return <Podsjetnici />

      case 'home':
      default:
        return <Home />
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