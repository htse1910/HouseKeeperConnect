using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IBooking_SlotsRepository
    {
        Task<List<Booking_Slots>> GetAllBooking_SlotsAsync();

        Task<Booking_Slots> GetBooking_SlotsByIDAsync(int id);

        Task<List<Booking_Slots>> GetBooking_SlotsByBookingIDAsync(int bookingId);

        Task AddBooking_SlotsAsync(Booking_Slots bookingSlots);

        Task DeleteBooking_SlotsAsync(int id);

        Task<bool> IsSlotBooked(int housekeeperId, int slotId, int dayOfWeek, DateTime startDate, DateTime endDate);

        Task<List<int>> GetBookedSlotsByHousekeeper(int housekeeperId, DateTime startDate, DateTime endDate);

        Task<List<int>> GetAllSlotIDsAsync();
        Task UpdateBooking_SlotAsync(Booking_Slots bookingSlot);
    }
}