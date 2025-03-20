using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IScheduleRepository
    {
        Task<List<Housekeeper_Schedule>> GetAllSchedulesAsync();

        Task<Housekeeper_Schedule> GetScheduleByIDAsync(int id);

        Task<List<Housekeeper_Schedule>> GetScheduleByHousekeeperAsync(int housekeeperId);

        Task AddScheduleAsync(Housekeeper_Schedule schedule);

        Task DeleteScheduleAsync(int id);

        Task UpdateScheduleAsync(Housekeeper_Schedule schedule);
    }
}