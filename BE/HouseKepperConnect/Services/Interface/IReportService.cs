using BusinessObject.Models;

namespace Services.Interface
{
    public interface IReportService
    {
        Task<List<Report>> GetAllReportsAsync();

        Task<Report> GetReportByIDAsync(int rID);

        Task AddReportAsync(Report Report);

        Task DeleteReportAsync(int id);

        Task UpdateReportAsync(Report Report);
    }
}