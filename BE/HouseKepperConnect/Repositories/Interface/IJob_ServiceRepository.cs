﻿using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IJob_ServiceRepository
    {
        Task<List<Job_Service>> GetAllJob_ServicesAsync();

        Task<Job_Service> GetJob_ServiceByIDAsync(int id);

        Task<List<Job_Service>> GetJob_ServicesByJobIDAsync(int jobId);

        Task AddJob_ServiceAsync(Job_Service jobService);

        Task DeleteJob_ServiceAsync(int id);
    }
}