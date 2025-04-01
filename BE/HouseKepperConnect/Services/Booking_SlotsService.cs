using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class Booking_SlotsService : IBooking_SlotsService
    {
        private readonly IBooking_SlotsRepository _bookingSlotsRepository;
        private readonly PCHWFDBContext _context;

        public Booking_SlotsService(IBooking_SlotsRepository bookingSlotsRepository)
        {
            _bookingSlotsRepository = bookingSlotsRepository;
        }

        public async Task<List<Booking_Slots>> GetAllBooking_SlotsAsync()
        {
            return await _bookingSlotsRepository.GetAllBooking_SlotsAsync();
        }

        public async Task<Booking_Slots> GetBooking_SlotsByIDAsync(int id)
        {
            return await _bookingSlotsRepository.GetBooking_SlotsByIDAsync(id);
        }

        public async Task<List<Booking_Slots>> GetBooking_SlotsByBookingIDAsync(int bookingId)
        {
            return await _bookingSlotsRepository.GetBooking_SlotsByBookingIDAsync(bookingId);
        }

        public async Task AddBooking_SlotsAsync(Booking_Slots bookingSlots)
        {
            await _bookingSlotsRepository.AddBooking_SlotsAsync(bookingSlots);
        }

        public async Task DeleteBooking_SlotsAsync(int id)
        {
            await _bookingSlotsRepository.DeleteBooking_SlotsAsync(id);
        }

        public async Task<bool> IsSlotBooked(int housekeeperId, int slotId, int dayOfWeek, DateTime startDate, DateTime endDate)
        {
            return await _context.Booking_Slots
                .Include(bs => bs.Booking)
                .AnyAsync(bs =>
                    bs.SlotID == slotId &&
                    bs.DayOfWeek == dayOfWeek &&
                    bs.Booking.HousekeeperID == housekeeperId &&
                    bs.Booking.CreatedAt >= startDate &&
                    bs.Booking.CreatedAt <= endDate
                );
        }

        public async Task<List<int>> GetAvailableSlotsByHousekeeper(int housekeeperId, DateTime startDate, DateTime endDate)
        {
            var allSlots = await _bookingSlotsRepository.GetAllSlotIDsAsync(); // Use repository directly
            var bookedSlots = await _bookingSlotsRepository.GetBookedSlotsByHousekeeper(housekeeperId, startDate, endDate);

            return allSlots.Except(bookedSlots).ToList();
        }

        public async Task<List<int>> GetAllSlotIDs()
        {
            return await _bookingSlotsRepository.GetAllSlotIDsAsync(); // Await the Task<List<int>> here as well
        }
    }
}