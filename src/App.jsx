import { PreferencesProvider, usePreferences } from './i18n/Preferences'

import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams, useLocation } from 'react-router-dom'
import './App.css'

import Sidebar from './components/Sidebar'
import Auth from './components/Auth'

import Home from './pages/Home'
import Vozila from './pages/Vozila'
import DetaljiVozila from './pages/DetaljiVozila'
import Servisi from './pages/Servisi'
import Gorivo from './pages/Gorivo'
import Troskovi from './pages/Troskovi'
import Podsjetnici from './pages/Podsjetnici'
import Postavke from './pages/Postavke'
import Statistika from './pages/Statistika'
import Kalendar from './pages/Kalendar'
import Pomoc from './pages/Pomoc'
import Putovanja from './pages/Putovanja'
import Vrijeme from './pages/Vrijeme'
import Galerija from './pages/Galerija'
import { deleteVehicleGallery } from './utils/galleryStorage'

import { deletePhoto } from './utils/photoStorage'
import useGarageData from './hooks/useGarageData'

import {
  getCurrentUser,
  logoutUser,
} from './services/authService'

import {
  addVehicle,
  updateVehicle,
  deleteVehicle,
  deleteVehicleRelatedData,
} from './services/vehicleService'

function VehicleDetailsRoute({ vehicles, registrationRecords, setRegistrationRecords, reminders, handleAddReminder, services, expenses, handleBackToVehicles, handleDeleteVehicle, handleAddService, handleDeleteService, handleUpdateService, handleUpdateVehicle, handleAddExpense, handleDeleteExpense, handleUpdateExpense }) {
  const { id } = useParams()
  const vehicle = vehicles.find((item) => String(item.id) === id)
  if (!vehicle) return <Navigate to="/vozila" replace />
  return (
    <DetaljiVozila
      vehicle={vehicle}
      registrationRecords={registrationRecords}
      onSetRegistrationRecords={setRegistrationRecords}
      reminders={reminders}
      onAddReminder={handleAddReminder}
      services={services}
      expenses={expenses}
      onBack={handleBackToVehicles}
      onDelete={handleDeleteVehicle}
      onAddService={handleAddService}
      onDeleteService={handleDeleteService}
      onUpdateService={handleUpdateService}
      onUpdateVehicle={handleUpdateVehicle}
      onAddExpense={handleAddExpense}
      onDeleteExpense={handleDeleteExpense}
      onUpdateExpense={handleUpdateExpense}
    />
  )
}

function GarageApp({ user, onLogout }) {
  const { t } = usePreferences()
  const navigate = useNavigate()
  const location = useLocation()
  const activePage = location.pathname.split('/')[1] || 'home'

  const {
    vehicles,
    setVehicles,
    services,
    setServices,
    serviceParts,
    setServiceParts,
    fuelRecords,
    setFuelRecords,
    expenses,
    setExpenses,
    reminders,
    setReminders,
    maintenancePlans,
    setMaintenancePlans,
    registrationRecords,
    setRegistrationRecords,
    trips,
    setTrips,
  } = useGarageData(user.id)

  function handleNavigate(page) {
    navigate(page === 'home' ? '/' : `/${page}`)
  }

  function handleSelectVehicle(vehicle) {
    navigate(`/vozila/${encodeURIComponent(vehicle.id)}`)
  }

  function handleBackToVehicles() {
    navigate('/vozila')
  }

  function handleAddVehicle(vehicle) {
    setVehicles((current) => addVehicle(current, vehicle))
  }

  function handleUpdateVehicle(updatedVehicle) {
    setVehicles((current) =>
      updateVehicle(current, updatedVehicle),
    )


  }

  function handleDeleteVehicle(id) {
    setVehicles((current) =>
      deleteVehicle(current, id),
    )

    setServices((current) =>
      deleteVehicleRelatedData(current, id),
    )

    setFuelRecords((current) =>
      deleteVehicleRelatedData(current, id),
    )

    setExpenses((current) =>
      deleteVehicleRelatedData(current, id),
    )

    setReminders((current) =>
      deleteVehicleRelatedData(current, id),
    )

    setMaintenancePlans((current) => deleteVehicleRelatedData(current, id))
    setRegistrationRecords((current) => deleteVehicleRelatedData(current, id))
    setTrips((current) => current.map((trip) => String(trip.vehicleId) === String(id) ? { ...trip, vehicleId: '' } : trip))

    if (location.pathname.startsWith('/vozila/')) navigate('/vozila')

    deleteVehicleGallery(user.id, id).catch(console.error)
    deletePhoto(id).catch((error) => {
      console.error(
        'Brisanje fotografije nije uspjelo:',
        error,
      )
    })
  }

  function handleAddService(service) {
    setServices((current) => [...current, service])
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
    setFuelRecords((current) => [...current, record])
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
    setExpenses((current) => [...current, expense])
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
    setReminders((current) => [...current, reminder])
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

  function renderPageFor(page) {
    switch (page) {
      case 'detalji-vozila':
        return (
          <VehicleDetailsRoute
            vehicles={vehicles}
            registrationRecords={registrationRecords}
            setRegistrationRecords={setRegistrationRecords}
            reminders={reminders}
            handleAddReminder={handleAddReminder}
            services={services}
            expenses={expenses}
            handleBackToVehicles={handleBackToVehicles}
            handleDeleteVehicle={handleDeleteVehicle}
            handleAddService={handleAddService}
            handleDeleteService={handleDeleteService}
            handleUpdateService={handleUpdateService}
            handleUpdateVehicle={handleUpdateVehicle}
            handleAddExpense={handleAddExpense}
            handleDeleteExpense={handleDeleteExpense}
            handleUpdateExpense={handleUpdateExpense}
          />
        )

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
            serviceParts={serviceParts}
            onSetServiceParts={setServiceParts}
            maintenancePlans={maintenancePlans}
            onSetMaintenancePlans={setMaintenancePlans}
            reminders={reminders}
            onAddReminder={handleAddReminder}
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

      case 'statistika':
        return <Statistika vehicles={vehicles} services={services} fuelRecords={fuelRecords} expenses={expenses} reminders={reminders} maintenancePlans={maintenancePlans} registrationRecords={registrationRecords} />

      case 'kalendar':
        return <Kalendar vehicles={vehicles} services={services} reminders={reminders} maintenancePlans={maintenancePlans} registrationRecords={registrationRecords} trips={trips} onNavigate={handleNavigate} />

      case 'putovanja':
        return <Putovanja vehicles={vehicles} trips={trips} onSetTrips={setTrips} />

      case 'galerija':
        return <Galerija vehicles={vehicles} userId={user.id} onSelectVehicle={handleSelectVehicle} />

      case 'vrijeme':
        return <Vrijeme trips={trips} />

      case 'pomoc':
        return <Pomoc onNavigate={handleNavigate} />

      case 'postavke':
        return <Postavke userId={user.id} />

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
        activePage={activePage === 'vozila' ? 'vozila' : activePage}
        onNavigate={handleNavigate}
      />

      <main className="main-content">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '14px',
            marginBottom: '18px',
          }}
        >
          <span
            style={{
              color: '#aeb4ba',
              fontSize: '13px',
            }}
          >
            {user.name}
          </span>

          <button
            type="button"
            onClick={onLogout}
            style={{
              padding: '8px 14px',
              backgroundColor: '#24282c',
              border: '1px solid #41464b',
              borderRadius: '6px',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            {t('Odjava')}
          </button>
        </div>

        <Routes>
          <Route path="/" element={renderPageFor('home')} />
          {['vozila', 'servisi', 'gorivo', 'troskovi', 'podsjetnici', 'statistika', 'kalendar', 'putovanja', 'vrijeme', 'galerija', 'pomoc', 'postavke'].map((page) => (
            <Route key={page} path={`/${page}`} element={renderPageFor(page)} />
          ))}
          <Route path="/vozila/:id" element={renderPageFor('detalji-vozila')} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function AppContent() {
  const [currentUser, setCurrentUser] = useState(
    () => getCurrentUser(),
  )

  function handleAuthenticated(user) {
    setCurrentUser(user)
  }

  function handleLogout() {
    logoutUser()
    setCurrentUser(null)
  }

  if (!currentUser) {
    return (
      <Auth onAuthenticated={handleAuthenticated} />
    )
  }

  return (
    <GarageApp
      key={currentUser.id}
      user={currentUser}
      onLogout={handleLogout}
    />
  )
}

function App() {
  return <PreferencesProvider><BrowserRouter><AppContent /></BrowserRouter></PreferencesProvider>
}

export default App