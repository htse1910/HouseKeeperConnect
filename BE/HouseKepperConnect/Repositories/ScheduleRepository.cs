using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class ScheduleRepository : IScheduleRepository
    {
        public async Task AddScheduleAsync(Housekeeper_Schedule schedule) => await ScheduleDAO.Instance.AddScheduleAsync(schedule);

        public async Task DeleteScheduleAsync(int id) => await ScheduleDAO.Instance.DeleteScheduleAsync(id);

        public async Task<List<Housekeeper_Schedule>> GetAllSchedulesAsync() => await ScheduleDAO.Instance.GetAllSchedulesAsync();

        public async Task<Housekeeper_Schedule> GetScheduleByIDAsync(int id) => await ScheduleDAO.Instance.GetScheduleByIDAsync(id);

        public async Task<List<Housekeeper_Schedule>> GetScheduleByHousekeeperAsync(int housekeeperId) => await ScheduleDAO.Instance.GetSchedulesByHousekeeperAsync(housekeeperId);

        public async Task UpdateScheduleAsync(Housekeeper_Schedule schedule) => await ScheduleDAO.Instance.UpdateScheduleAsync(schedule);
    }
}