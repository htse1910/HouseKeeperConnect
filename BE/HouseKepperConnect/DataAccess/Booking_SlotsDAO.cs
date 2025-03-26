using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class Booking_SlotsDAO
    {
        private static Booking_SlotsDAO instance;
        private static readonly object instanceLock = new object();

        public static Booking_SlotsDAO Instance
        {
            get
            {
                lock (instanceLock)
                {
                    if (instance == null)
                    {
                        instance = new Booking_SlotsDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Booking_Slots>> GetAllBooking_SlotsAsync()
        {
            using var context = new PCHWFDBContext();
            return await context.Booking_Slots.Include(bs => bs.Booking).Include(bs => bs.Slot).ToListAsync();
        }

        public async Task<Booking_Slots> GetBooking_SlotByIdAsync(int id)
        {
            using var context = new PCHWFDBContext();
            return await context.Booking_Slots.Include(bs => bs.Booking).Include(bs => bs.Slot)
                .SingleOrDefaultAsync(bs => bs.Booking_SlotsId == id);
        }

        public async Task<List<Booking_Slots>> GetBooking_SlotsByBookingIdAsync(int bookingId)
        {
            using var context = new PCHWFDBContext();
            return await context.Booking_Slots.Where(bs => bs.BookingID == bookingId)
                .Include(bs => bs.Slot).ToListAsync();
        }

        public async Task<List<Booking_Slots>> GetBooking_SlotsBySlotIdAsync(int slotId)
        {
            using var context = new PCHWFDBContext();
            return await context.Booking_Slots.Where(bs => bs.SlotID == slotId)
                .Include(bs => bs.Booking).ToListAsync();
        }

        public async Task AddBooking_SlotAsync(Booking_Slots bookingSlot)
        {
            using var context = new PCHWFDBContext();
            context.Booking_Slots.Add(bookingSlot);
            await context.SaveChangesAsync();
        }

        public async Task DeleteBooking_SlotAsync(int id)
        {
            using var context = new PCHWFDBContext();
            var bookingSlot = await context.Booking_Slots.FindAsync(id);
            if (bookingSlot != null)
            {
                context.Booking_Slots.Remove(bookingSlot);
                await context.SaveChangesAsync();
            }
        }
    }
}