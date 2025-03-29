using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class Booking_SlotsService : IBooking_SlotsService
    {
        private readonly IBooking_SlotsRepository _bookingSlotsRepository;

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
    }
}