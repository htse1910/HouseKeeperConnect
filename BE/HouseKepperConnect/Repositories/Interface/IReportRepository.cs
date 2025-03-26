using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IReportRepository
    {
        Task<List<Report>> GetAllReportsAsync(int pageNumber, int pageSize);

        Task<Report> GetReportByIDAsync(int rID);

        Task<List<Report>> GetReportsByAccountAsync(int accountId);

        Task AddReportAsync(Report Report);

        Task DeleteReportAsync(int id);

        Task UpdateReportAsync(Report Report);
    }
}