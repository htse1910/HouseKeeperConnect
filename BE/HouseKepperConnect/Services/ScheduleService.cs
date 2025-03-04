using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class ScheduleService : IScheduleService
    {
        private readonly IScheduleRepository _scheduleRepository;

        public ScheduleService(IScheduleRepository scheduleRepository)
        {
            _scheduleRepository = scheduleRepository;
        }

        public async Task AddScheduleAsync(Schedule schedule) => await _scheduleRepository.AddScheduleAsync(schedule);

        public async Task DeleteScheduleAsync(int id) => await _scheduleRepository.DeleteScheduleAsync(id);

        public async Task<List<Schedule>> GetAllSchedulesAsync() => await _scheduleRepository.GetAllSchedulesAsync();

        public async Task<Schedule> GetScheduleByIDAsync(int id) => await _scheduleRepository.GetScheduleByIDAsync(id);

        public async Task<List<Schedule>> GetScheduleByHousekeeperAsync(int housekeeperId) => await _scheduleRepository.GetScheduleByHousekeeperAsync(housekeeperId);

        public async Task UpdateScheduleAsync(Schedule schedule) => await _scheduleRepository.UpdateScheduleAsync(schedule);
    }
}
