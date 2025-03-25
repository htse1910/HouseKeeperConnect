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
    }
}