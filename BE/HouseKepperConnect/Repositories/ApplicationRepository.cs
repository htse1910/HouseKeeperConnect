using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        public async Task AddApplicationAsync(Application noti) => await ApplicationDAO.Instance.AddApplicationAsync(noti);

        public async Task DeleteApplicationAsync(int id) => await ApplicationDAO.Instance.DeleteApplicationAsync(id);

        public async Task<List<Application>> GetAllApplicationsAsync(int pageNumber, int pageSize) => await ApplicationDAO.Instance.GetAllApplicationsAsync(pageNumber, pageSize);

        public async Task<List<Application>> GetAllApplicationsByJobIDAsync(int jobID, int pageNumber, int pageSize) => await ApplicationDAO.Instance.GetAllApplicationsByJobIDAsync(jobID, pageNumber, pageSize);

        public async Task<List<Application>> GetAllApplicationsByJobIDAsync(int jobID) => await ApplicationDAO.Instance.GetAllApplicationsByJobIDAsync(jobID);

        public async Task<List<Application>> GetAllApplicationsByUserAsync(int uid, int pageNumber, int pageSize) => await ApplicationDAO.Instance.GetAllApplicationsByUserAsync(uid, pageNumber, pageSize);

        public async Task<List<Application>> GetAllApplicationsByUserAsync(int uid) => await ApplicationDAO.Instance.GetAllApplicationsByUserAsync(uid);
        public async Task<Application> GetApplicationByHKIDAsync(int id) => await ApplicationDAO.Instance.GetApplicationByHKIDAsync(id);

        public async Task<Application> GetApplicationByIDAsync(int id) => await ApplicationDAO.Instance.GetApplicationByIDAsync(id);

        public async Task UpdateApplicationAsync(Application noti) => await ApplicationDAO.Instance.UpdateApplicationAsync(noti);
    }
}