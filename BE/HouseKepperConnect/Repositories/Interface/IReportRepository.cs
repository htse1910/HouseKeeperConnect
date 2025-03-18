using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IReportRepository
    {
        Task<List<Report>> GetAllReportsAsync();
        Task<Report> GetReportByIDAsync(int rID);
        Task AddReportAsync(Report Report);
        Task DeleteReportAsync(int id);
        Task UpdateReportAsync(Report Report);
    }
}
