using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class ScheduleService : IScheduleService
    {
        private readonly IScheduleRepository _scheduleRepository;

        public ScheduleService(IScheduleRepository scheduleRepository)
        {
            _scheduleRepository = scheduleRepository;
        }

        public async Task AddScheduleAsync(Housekeeper_Schedule schedule) => await _scheduleRepository.AddScheduleAsync(schedule);

        public async Task DeleteScheduleAsync(int id) => await _scheduleRepository.DeleteScheduleAsync(id);

        public async Task<List<Housekeeper_Schedule>> GetAllSchedulesAsync() => await _scheduleRepository.GetAllSchedulesAsync();

        public async Task<Housekeeper_Schedule> GetScheduleByIDAsync(int id) => await _scheduleRepository.GetScheduleByIDAsync(id);

        public async Task<List<Housekeeper_Schedule>> GetScheduleByHousekeeperAsync(int housekeeperId) => await _scheduleRepository.GetScheduleByHousekeeperAsync(housekeeperId);

        public async Task UpdateScheduleAsync(Housekeeper_Schedule schedule) => await _scheduleRepository.UpdateScheduleAsync(schedule);
    }
}