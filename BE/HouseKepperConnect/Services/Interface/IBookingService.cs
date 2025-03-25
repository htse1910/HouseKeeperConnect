using BusinessObject.Models;

namespace Services.Interface
{
    public interface IBookingService
    {
        Task AddBookingAsync(Booking booking);

        Task DeleteBookingAsync(int id);

        Task<List<Booking>> GetAllBookingsAsync();

        Task<Booking> GetBookingByIDAsync(int id);

        Task<List<Booking>> GetBookingsByHousekeeperIDAsync(int housekeeperId);

        Task<List<Booking>> GetBookingsByJobIDAsync(int jobId);

        Task UpdateBookingAsync(Booking booking);
    }
}