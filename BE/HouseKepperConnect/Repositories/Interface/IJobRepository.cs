using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IJobRepository
    {
        Task<List<Job>> GetAllJobsAsync(int pageNumber, int pageSize);

        Task<List<Job>> GetAllPendingJobsAsync(int pageNumber, int pageSize);

        Task<List<Job>> GetAllJobsForStaffAsync(int pageNumber, int pageSize);

        Task<List<Job>> GetAcceptedJobsForStaffAsync(int pageNumber, int pageSize);

        Task<List<Job>> GetExpiredJobForAdminAsync(int pageNumber, int pageSize, DateTime time);

        Task<int> CountExpiredJobsAsync(DateTime date);

        Task<int> CountVerifiedJobsStaffAsync();

        Task<int> CountAcceptedJobsStaffAsync();

        Task<int> CountVerifiedJobsAsync();

        Task<int> CountPendingJobsAsync();

        Task<int> CountJobsByAccountIDAsync(int familyID);

        Task<int> CountJobsOfferByAccountIDAsync(int housekeeperID);

        Task<List<JobDetail>> GetAllDetailJobsAsync(int pageNumber, int pageSize);

        Task<Job> GetJobByIDAsync(int id);

        Task<List<Job>> GetJobsOfferedByHKAsync(int hktId, int pageNumber, int pageSize);

        Task<List<Job>> GetJobsByAccountIDAsync(int accountId, int pageNumber, int pageSize);

        Task<JobDetail> GetJobDetailByJobIDAsync(int jobID);

        Task<List<JobDetail>> SearchJobsAsync(string name, int pageNumber, int pageSize);

        Task<List<JobDetail>> SearchJobByConditionsAssync(string name, string location = null, decimal? minPrice = null, decimal? maxPrice = null, int? jobType = null);

        Task AddJobAsync(Job job);

        Task AddJobDetailAsync(JobDetail jobDetail);

        Task DeleteJobAsync(int id);
        Task DeleteJobDetailAsync(int id);

        Task UpdateJobAsync(Job job);

        Task UpdateJobDetailAsync(JobDetail jobdetail);
    }
}