using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
