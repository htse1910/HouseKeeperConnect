using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;

        public BookingService(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        public async Task AddBookingAsync(Booking booking) => await _bookingRepository.AddBookingAsync(booking);

        public async Task<int> CountBookingsByHousekeeperIDAsync(int housekeeperID) => await _bookingRepository.CountBookingsByHousekeeperIDAsync(housekeeperID);

        public async Task DeleteBookingAsync(int id) => await _bookingRepository.DeleteBookingAsync(id);

        public async Task<List<Booking>> GetAllBookingsAsync() => await _bookingRepository.GetAllBookingsAsync();

        public async Task<Booking> GetBookingByIDAsync(int id) => await _bookingRepository.GetBookingByIDAsync(id);

        public async Task<Booking> GetBookingByJobIDAsync(int jobID) => await _bookingRepository.GetBookingByJobIDAsync(jobID);

        public async Task<List<Booking>> GetBookingsByHousekeeperIDAsync(int housekeeperId, int pageNumber, int pageSize) =>
            await _bookingRepository.GetBookingsByHousekeeperIDAsync(housekeeperId, pageNumber, pageSize);

        public async Task<List<Booking>> GetBookingsByJobIDAsync(int jobId) =>
            await _bookingRepository.GetBookingsByJobIDAsync(jobId);

        public async Task UpdateBookingAsync(Booking booking) => await _bookingRepository.UpdateBookingAsync(booking);
    }
}