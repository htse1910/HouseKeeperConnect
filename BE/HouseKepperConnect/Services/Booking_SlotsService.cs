using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class Booking_SlotsService : IBooking_SlotsService
    {
        private readonly IBooking_SlotsRepository _bookingSlotsRepository;
        private readonly PCHWFDBContext _dbContext;

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

        public async Task AddBooking_SlotsAsync(List<Booking_Slots> bookingSlots)
        {
            if (bookingSlots == null || !bookingSlots.Any())
                throw new ArgumentException("Booking slots list cannot be empty.");

            await _dbContext.Booking_Slots.AddRangeAsync(bookingSlots); // Bulk insert
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteBooking_SlotsAsync(int id)
        {
            await _bookingSlotsRepository.DeleteBooking_SlotsAsync(id);
        }
    }
}