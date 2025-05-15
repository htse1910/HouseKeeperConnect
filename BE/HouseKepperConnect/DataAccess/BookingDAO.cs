using AutoMapper;
using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class BookingDAO
    {
        private readonly IMapper _mapper;
        private static BookingDAO instance;
        private static readonly object instancelock = new object();

        public BookingDAO()
        { }

        public static BookingDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new BookingDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Booking>> GetAllBookingsAsync()
        {
            var list = new List<Booking>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Booking
                        .Include(b => b.Job)
                        .Include(b => b.Housekeeper)
                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Booking> GetBookingByIDAsync(int id)
        {
            Booking booking = new Booking();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    booking = await context.Booking
                        .Include(b => b.Job)
                        .Include(b => b.Housekeeper)
                        .SingleOrDefaultAsync(b => b.BookingID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return booking;
        }

        public async Task<Booking> GetBookingByJobIDAsync(int jobID)
        {
            Booking booking = new Booking();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    booking = await context.Booking
                        .Include(b => b.Job)
                        .Include(b => b.Housekeeper)
                        .SingleOrDefaultAsync(b => b.JobID == jobID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return booking;
        }

        /*        public async Task<List<Booking>> GetBookingsByFamilyIDAsync(int familyId)
                {
                    using var context = new PCHWFDBContext();
                    return await context.Booking
                        .Where(b => b.FamilyID == familyId)
                        .Include(b => b.Job)
                        .Include(b => b.Housekeeper)
                        .ToListAsync();
                }*/

        public async Task<int> CountBookingsByHousekeeperIDAsync(int housekeeperID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Booking
                        .AsNoTracking()
                        .CountAsync(j => j.HousekeeperID == housekeeperID)
                        .ConfigureAwait(false);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<Booking>> GetBookingsByHousekeeperIDAsync(int housekeeperId, int pageNumber, int pageSize)
        {
            using var context = new PCHWFDBContext();
            return await context.Booking
                .Where(b => b.HousekeeperID == housekeeperId)
                .AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize)
                .ToListAsync();
        }

        public async Task<List<Booking>> GetBookingsByJobIDAsync(int jobId)
        {
            using var context = new PCHWFDBContext();
            return await context.Booking
                .Where(b => b.JobID == jobId)
                .ToListAsync();
        }

        public async Task AddBookingAsync(Booking booking)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Booking.Add(booking);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteBookingAsync(int id)
        {
            var booking = await GetBookingByIDAsync(id);
            if (booking != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Booking.Remove(booking);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateBookingAsync(Booking booking)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(booking).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}