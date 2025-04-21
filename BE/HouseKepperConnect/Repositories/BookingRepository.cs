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

        public async Task AddBookingAsync(Booking booking) => await _bookingDAO.AddBookingAsync(booking);

        public async Task DeleteBookingAsync(int id) => await _bookingDAO.DeleteBookingAsync(id);

        public async Task<List<Booking>> GetAllBookingsAsync() => await _bookingDAO.GetAllBookingsAsync();

        public async Task<Booking> GetBookingByIDAsync(int id) => await _bookingDAO.GetBookingByIDAsync(id);

        public async Task<Booking> GetBookingByJobIDAsync(int jobID) => await _bookingDAO.GetBookingByJobIDAsync(jobID);

        public async Task<List<Booking>> GetBookingsByHousekeeperIDAsync(int housekeeperId) => await _bookingDAO.GetBookingsByHousekeeperIDAsync(housekeeperId);

        public async Task<List<Booking>> GetBookingsByJobIDAsync(int jobId) => await _bookingDAO.GetBookingsByJobIDAsync(jobId);

        public async Task UpdateBookingAsync(Booking booking) => await _bookingDAO.UpdateBookingAsync(booking);
    }
}