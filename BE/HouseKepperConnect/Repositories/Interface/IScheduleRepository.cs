using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IScheduleRepository
    {
        Task<List<Schedule>> GetAllSchedulesAsync();

        Task<Schedule> GetScheduleByIDAsync(int id);

        Task<List<Schedule>> GetScheduleByHousekeeperAsync(int housekeeperId);

        Task AddScheduleAsync(Schedule schedule);

        Task DeleteScheduleAsync(int id);

        Task UpdateScheduleAsync(Schedule schedule);
    }
}