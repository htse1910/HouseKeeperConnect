using BusinessObject.Models;

namespace Services.Interface
{
    public interface IJobListing_ApplicationService
    {
        Task<List<JobListing_Application>> GetAllJob_ApplicationsAsync(int pageNumber, int pageSize);

        Task<List<JobListing_Application>> GetAllJob_ApplicationsByJobAsync(int uid, int pageNumber, int pageSize);

        Task<JobListing_Application> GetJob_ApplicationByIDAsync(int id);

        Task<JobListing_Application> GetJob_ApplicationByAppAsync(int id);

        Task AddJob_ApplicationAsync(JobListing_Application noti);

        Task DeleteJob_ApplicationAsync(int id);

        Task UpdateJob_ApplicationAsync(JobListing_Application noti);
    }
}