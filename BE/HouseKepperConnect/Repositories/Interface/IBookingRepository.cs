using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IBookingRepository
    {
        Task<List<Booking>> GetAllBookingsAsync();

        Task<Booking> GetBookingByIDAsync(int id);

        Task<List<Booking>> GetBookingsByHousekeeperIDAsync(int housekeeperId);

        Task<List<Booking>> GetBookingsByFamilyIDAsync(int familyId);

        Task<List<Booking>> GetBookingsByJobIDAsync(int jobId);

        Task AddBookingAsync(Booking booking);

        Task UpdateBookingAsync(Booking booking);

        Task DeleteBookingAsync(int id);
    }
}