﻿using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IIDVerificationRepository
    {
        Task<List<IDVerification>> GetAllIDVerifysAsync(int pageNumber, int pageSize);

        Task<IDVerification> GetIDVerifyByIDAsync(int id);

        Task<int> AddIDVerifyAsync(IDVerification veri);

        Task UpdateIDVerifyAsync(IDVerification veri);
    }
}