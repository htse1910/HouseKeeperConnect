using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class Booking_SlotsRepository : IBooking_SlotsRepository
    {
        private readonly Booking_SlotsDAO _bookingSlotsDAO;

        public Booking_SlotsRepository()
        {
            _bookingSlotsDAO = Booking_SlotsDAO.Instance;
        }

        public Task AddBooking_SlotsAsync(Booking_Slots bookingSlots) => _bookingSlotsDAO.AddBooking_SlotAsync(bookingSlots);

        public Task DeleteBooking_SlotsAsync(int id) => _bookingSlotsDAO.DeleteBooking_SlotAsync(id);

        public Task<List<Booking_Slots>> GetAllBooking_SlotsAsync() => _bookingSlotsDAO.GetAllBooking_SlotsAsync();

        public Task<Booking_Slots> GetBooking_SlotsByIDAsync(int id) => _bookingSlotsDAO.GetBooking_SlotByIdAsync(id);

        public Task<List<Booking_Slots>> GetBooking_SlotsByBookingIDAsync(int bookingId) => _bookingSlotsDAO.GetBooking_SlotsByBookingIdAsync(bookingId);

        /*public async Task<bool> IsSlotBooked(int housekeeperId, int slotId, int dayOfWeek, DateTime startDate, DateTime endDate)
        {
            var bookedSlots = await _bookingSlotsDAO.GetBookedSlotsByHousekeeper(housekeeperId, startDate, endDate);

            return bookedSlots.Contains(slotId); // If slotId exists in booked slots, return true
        }*/

        public async Task<bool> IsSlotBooked(int housekeeperId, int slotId, int dayOfWeek, DateTime startDate, DateTime endDate)
            => await _bookingSlotsDAO.IsSlotBooked(housekeeperId, slotId, dayOfWeek, startDate, endDate);

        public async Task<List<int>> GetBookedSlotsByHousekeeper(int housekeeperId, DateTime startDate, DateTime endDate)
        => await _bookingSlotsDAO.GetBookedSlotsByHousekeeper(housekeeperId, startDate, endDate);

        public async Task<List<int>> GetAllSlotIDsAsync() => await _bookingSlotsDAO.GetAllSlotIDsAsync();

        public async Task UpdateBooking_SlotAsync(Booking_Slots bookingSlot)
        {
            await _bookingSlotsDAO.UpdateBooking_SlotAsync(bookingSlot);
        }

        public async Task<List<Booking_Slots>> GetBookingSlotsByDateAndBookingIDAsync(int bookingId, DateTime date)
        {
            return await _bookingSlotsDAO.GetBookingSlotsByDateAndBookingIDAsync(bookingId, date);
        }
        public async Task<List<Booking_Slots>> GetBookingSlotsForHousekeeperByWeekAsync(int housekeeperId, DateTime weekStart, DateTime weekEnd)
            => await Booking_SlotsDAO.Instance.GetBookingSlotsForHousekeeperByWeekAsync(housekeeperId, weekStart, weekEnd);
    }
}