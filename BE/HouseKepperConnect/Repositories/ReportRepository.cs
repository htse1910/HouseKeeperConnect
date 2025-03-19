using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class ReportRepository : IReportRepository
    {
        public async Task<List<Report>> GetAllReportsAsync() => await ReportDAO.Instance.GetAllReportsAsync();

        public async Task<Report> GetReportByIDAsync(int rID) => await ReportDAO.Instance.GetReportByIDAsync(rID);

        public async Task AddReportAsync(Report Report) => await ReportDAO.Instance.AddReportAsync(Report);

        public async Task DeleteReportAsync(int id) => await ReportDAO.Instance.DeleteReportAsync(id);

        public async Task UpdateReportAsync(Report Report) => await ReportDAO.Instance.UpdateReportAsync(Report);
    }
}