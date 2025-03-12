using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly BookingDAO _bookingDAO;

        public BookingRepository()
        {
            _bookingDAO = BookingDAO.Instance;
        }

        public Task AddBookingAsync(Booking booking) => _bookingDAO.AddBookingAsync(booking);

        public Task DeleteBookingAsync(int id) => _bookingDAO.DeleteBookingAsync(id);

        public Task<List<Booking>> GetAllBookingsAsync() => _bookingDAO.GetAllBookingsAsync();

        public Task<Booking> GetBookingByIDAsync(int id) => _bookingDAO.GetBookingByIDAsync(id);

        public Task<List<Booking>> GetBookingsByHousekeeperIDAsync(int housekeeperId) => _bookingDAO.GetBookingsByHousekeeperIDAsync(housekeeperId);

        public Task<List<Booking>> GetBookingsByFamilyIDAsync(int familyId) => _bookingDAO.GetBookingsByFamilyIDAsync(familyId);

        public Task<List<Booking>> GetBookingsByJobIDAsync(int jobId) => _bookingDAO.GetBookingsByJobIDAsync(jobId);

        public Task UpdateBookingAsync(Booking booking) => _bookingDAO.UpdateBookingAsync(booking);
    }
}