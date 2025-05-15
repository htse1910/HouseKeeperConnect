using BusinessObject.Models;

namespace Services.Interface
{
    public interface IBookingService
    {
        Task AddBookingAsync(Booking booking);

        Task DeleteBookingAsync(int id);
        Task<int> CountBookingsByHousekeeperIDAsync(int housekeeperID);

        Task<List<Booking>> GetAllBookingsAsync();

        Task<Booking> GetBookingByIDAsync(int id);

        Task<Booking> GetBookingByJobIDAsync(int jobID);

        Task<List<Booking>> GetBookingsByHousekeeperIDAsync(int housekeeperId, int pageNumber, int pageSize);

        Task<List<Booking>> GetBookingsByJobIDAsync(int jobId);

        Task UpdateBookingAsync(Booking booking);
    }
}