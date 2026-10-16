import { PreferencesProvider, usePreferences } from './i18n/Preferences'

import { useState } from 'react'
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

function GarageApp({ user, onLogout }) {
  const { t } = usePreferences()
  const [activePage, setActivePage] = useState('home')
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  const {
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
  } = useGarageData(user.id)

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
    setVehicles((current) => addVehicle(current, vehicle))
  }

  function handleUpdateVehicle(updatedVehicle) {
    setVehicles((current) =>
      updateVehicle(current, updatedVehicle),
    )

    setSelectedVehicle(updatedVehicle)
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

    setSelectedVehicle(null)

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

  function renderPage() {
    if (activePage === 'vozila' && selectedVehicle) {
      return (
        <DetaljiVozila
          vehicle={selectedVehicle}
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
        activePage={activePage}
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

        {renderPage()}
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
  return <PreferencesProvider><AppContent /></PreferencesProvider>
}

export default App