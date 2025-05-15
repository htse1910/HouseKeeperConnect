using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IBookingRepository
    {
        Task<List<Booking>> GetAllBookingsAsync();

        Task<Booking> GetBookingByIDAsync(int id);
        Task<int> CountBookingsByHousekeeperIDAsync(int housekeeperID);

        Task<Booking> GetBookingByJobIDAsync(int jobID);

        Task<List<Booking>> GetBookingsByHousekeeperIDAsync(int housekeeperId, int pageNumber, int pageSize);

        Task<List<Booking>> GetBookingsByJobIDAsync(int jobId);

        Task AddBookingAsync(Booking booking);

        Task UpdateBookingAsync(Booking booking);

        Task DeleteBookingAsync(int id);
    }
}