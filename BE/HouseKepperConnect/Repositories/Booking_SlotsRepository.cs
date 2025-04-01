using BusinessObject.Models;
using DataAccess;
using Google;
using Microsoft.EntityFrameworkCore;
using Repositories.Interface;

namespace Repositories
{
    public class Booking_SlotsRepository : IBooking_SlotsRepository
    {
        private readonly Booking_SlotsDAO _bookingSlotsDAO;

        public Booking_SlotsRepository(Booking_SlotsDAO bookingSlotsDAO)
        {
            _bookingSlotsDAO = bookingSlotsDAO;
        }

        public Task AddBooking_SlotsAsync(Booking_Slots bookingSlots) => _bookingSlotsDAO.AddBooking_SlotAsync(bookingSlots);

        public Task DeleteBooking_SlotsAsync(int id) => _bookingSlotsDAO.DeleteBooking_SlotAsync(id);

        public Task<List<Booking_Slots>> GetAllBooking_SlotsAsync() => _bookingSlotsDAO.GetAllBooking_SlotsAsync();

        public Task<Booking_Slots> GetBooking_SlotsByIDAsync(int id) => _bookingSlotsDAO.GetBooking_SlotByIdAsync(id);

        public Task<List<Booking_Slots>> GetBooking_SlotsByBookingIDAsync(int bookingId) => _bookingSlotsDAO.GetBooking_SlotsByBookingIdAsync(bookingId);
        public async Task<bool> IsSlotBooked(int housekeeperId, int slotId, int dayOfWeek, DateTime startDate, DateTime endDate)
        {
            var bookedSlots = await _bookingSlotsDAO.GetBookedSlotsByHousekeeper(housekeeperId, startDate, endDate);

            return bookedSlots.Contains(slotId); // If slotId exists in booked slots, return true
        }
        public async Task<List<int>> GetBookedSlotsByHousekeeper(int housekeeperId, DateTime startDate, DateTime endDate)
        {
            using var context = new PCHWFDBContext();
            return await context.Booking_Slots
                .Where(bs => bs.Booking.HousekeeperID == housekeeperId &&
                             context.JobDetail.Any(jd => jd.JobID == bs.Booking.JobID &&
                                                          jd.StartDate <= endDate &&
                                                          jd.EndDate >= startDate))
                .Select(bs => bs.SlotID)
                .Distinct()
                .ToListAsync();
        }
        public async Task<List<int>> GetAllSlotIDsAsync()
        {
            using var context = new PCHWFDBContext();
            return await context.Booking_Slots
                .Select(bs => bs.SlotID)
                .Distinct()
                .ToListAsync(); // Return unique SlotIDs
        }

    }
}