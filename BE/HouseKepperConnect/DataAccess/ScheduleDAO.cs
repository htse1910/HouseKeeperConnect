using AutoMapper;
using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class ScheduleDAO
    {
        private readonly IMapper _mapper;
        private static ScheduleDAO instance;
        private static readonly object instanceLock = new object();

        public ScheduleDAO()
        { }

        public static ScheduleDAO Instance
        {
            get
            {
                lock (instanceLock)
                {
                    if (instance == null)
                    {
                        instance = new ScheduleDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Housekeeper_Schedule>> GetAllSchedulesAsync()
        {
            var list = new List<Housekeeper_Schedule>();
            try
            {
                using (var context = new PCHWFDBContext())

                {
                    list = await context.Housekeeper_Schedule
                        .Include(s => s.Housekeeper)
                        .Include(s => s.Slot)
                        .Include(s => s.DayOfWeek)
                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Housekeeper_Schedule> GetScheduleByIDAsync(int id)
        {
            Housekeeper_Schedule schedule = new Housekeeper_Schedule();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    schedule = await context.Housekeeper_Schedule
                        .Include(s => s.Housekeeper)
                        .Include(s => s.Slot)
                        .Include(s => s.DayOfWeek)
                        .SingleOrDefaultAsync(s => s.Housekeeper_ScheduleID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedule;
        }

        public async Task<List<Housekeeper_Schedule>> GetSchedulesByHousekeeperAsync(int housekeeperId)
        {
            var schedules = new List<Housekeeper_Schedule>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    schedules = await context.Housekeeper_Schedule
                        .Where(s => s.HousekeeperID == housekeeperId)
                        .Include(s => s.Slot)
                        .Include(s => s.DayOfWeek)
                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return schedules;
        }

        public async Task AddScheduleAsync(Housekeeper_Schedule schedule)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Housekeeper_Schedule.Add(schedule);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteScheduleAsync(int id)
        {
            var schedule = await GetScheduleByIDAsync(id);
            if (schedule != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Housekeeper_Schedule.Remove(schedule);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateScheduleAsync(Housekeeper_Schedule schedule)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(schedule).State = EntityState.Modified;
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