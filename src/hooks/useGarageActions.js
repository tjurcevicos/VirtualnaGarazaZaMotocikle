import { useLocation, useNavigate } from 'react-router-dom'
import { deleteVehicleGallery } from '../utils/galleryStorage'
import { deletePhoto } from '../utils/photoStorage'
import { addVehicle, updateVehicle, deleteVehicle, deleteVehicleRelatedData } from '../services/vehicleService'

export default function useGarageActions(userId, garage) {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    setVehicles,
    setServices,
    setFuelRecords,
    setExpenses,
    setReminders,
    setMaintenancePlans,
    setRegistrationRecords,
    setTrips,
  } = garage

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

    deleteVehicleGallery(userId, id).catch(console.error)
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

  return {
    handleAddVehicle,
    handleUpdateVehicle,
    handleDeleteVehicle,
    handleAddService,
    handleDeleteService,
    handleUpdateService,
    handleAddFuelRecord,
    handleDeleteFuelRecord,
    handleUpdateFuelRecord,
    handleAddExpense,
    handleDeleteExpense,
    handleUpdateExpense,
    handleAddReminder,
    handleDeleteReminder,
    handleUpdateReminder,
  }
}
