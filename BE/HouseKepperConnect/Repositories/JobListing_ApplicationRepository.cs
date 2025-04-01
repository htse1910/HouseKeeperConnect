using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class JobListing_ApplicationRepository : IJobListing_ApplicationRepository
    {
        public async Task AddJob_ApplicationAsync(JobListing_Application noti) => await Job_ApplicationDAO.Instance.AddJob_ApplicationAsync(noti);

        public async Task DeleteJob_ApplicationAsync(int id) => await Job_ApplicationDAO.Instance.DeleteJob_ApplicationAsync(id);

        public async Task<List<JobListing_Application>> GetAllJob_ApplicationsAsync(int pageNumber, int pageSize) => await Job_ApplicationDAO.Instance.GetAllJob_ApplicationsAsync(pageNumber, pageSize);

        public async Task<List<JobListing_Application>> GetAllJob_ApplicationsByJobAsync(int uid, int pageNumber, int pageSize) => await Job_ApplicationDAO.Instance.GetAllJob_ApplicationsByJobAsync(uid, pageNumber, pageSize);

        public async Task<JobListing_Application> GetJob_ApplicationByAppAsync(int id) => await Job_ApplicationDAO.Instance.GetJob_ApplicationByAppAsync(id);

        public async Task<JobListing_Application> GetJob_ApplicationByIDAsync(int id) => await Job_ApplicationDAO.Instance.GetJob_ApplicationByIDAsync(id);

        public async Task UpdateJob_ApplicationAsync(JobListing_Application noti) => await Job_ApplicationDAO.Instance.UpdateJob_ApplicationAsync(noti);
    }
}