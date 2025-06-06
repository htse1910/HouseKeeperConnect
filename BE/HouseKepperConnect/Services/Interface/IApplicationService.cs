﻿using BusinessObject.Models;

namespace Services.Interface
{
    public interface IApplicationService
    {
        Task<List<Application>> GetAllApplicationsAsync(int pageNumber, int pageSize);
        Task<List<Application>> GetApplicationsByJobIDAsync(int jobID);

        Task<int> CountApplicationsByJobIDAsync(int jobID);

        Task<int> CountApplicationsByHKIDAsync(int housekeeperID);
        Task<int> CountPendingApplicationsByHKAsync(int housekeeperID);
        Task<int> CountAcceptedApplicationsByHKAsync(int housekeeperID);
        Task<int> CountDenieddApplicationsByHKAsync(int housekeeperID);

        Task<List<Application>> GetAllApplicationsByUserAsync(int uid, int pageNumber, int pageSize);

        Task<List<Application>> GetAllApplicationsByJobIDAsync(int jobID, int pageNumber, int pageSize);
        Task<List<Application>> GetAllApplicationsByUserAsync(int uid);

        Task<List<Application>> GetAllApplicationsByJobIDAsync(int jobID);

        Task<Application> GetApplicationByIDAsync(int id);

        Task<Application> GetApplicationByHKIDAsync(int id);

        Task AddApplicationAsync(Application noti);

        Task DeleteApplicationAsync(int id);

        Task UpdateApplicationAsync(Application noti);
    }
}