using BusinessObject.Models;

namespace Services.Interface
{
    public interface IScheduleService
    {
        Task<List<Schedule>> GetAllSchedulesAsync();

        Task<Schedule> GetScheduleByIDAsync(int id);

        Task<List<Schedule>> GetScheduleByHousekeeperAsync(int housekeeperId);

        Task AddScheduleAsync(Schedule schedule);

        Task DeleteScheduleAsync(int id);

        Task UpdateScheduleAsync(Schedule schedule);
    }
}