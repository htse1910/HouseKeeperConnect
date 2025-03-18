using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _reportRepository;

        public ReportService(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }

        public async Task<List<Report>> GetAllReportsAsync() => await _reportRepository.GetAllReportsAsync();

        public async Task<Report> GetReportByIDAsync(int rID) => await _reportRepository.GetReportByIDAsync(rID);

        public async Task AddReportAsync(Report Report) => await _reportRepository.AddReportAsync(Report);

        public async Task DeleteReportAsync(int id) => await _reportRepository.DeleteReportAsync(id);

        public async Task UpdateReportAsync(Report Report) => await _reportRepository.UpdateReportAsync(Report);
    }
}