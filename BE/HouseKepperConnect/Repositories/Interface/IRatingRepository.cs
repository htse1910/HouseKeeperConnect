﻿using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IRatingRepository
    {
        Task<List<Rating>> GetAllRatingsAsync(int pageNumber, int pageSize);

        Task<Rating> GetRatingByIDAsync(int id);

        Task<List<Rating>> GetRatingsByHKAsync(int uId, int pageNumber, int pageSize);

        Task<List<Rating>> GetRatingsByHKAsync(int uId);

        Task<List<Rating>> GetRatingsByFAAsync(int uId, int pageNumber, int pageSize);

        Task AddRatingAsync(Rating ra);

        Task DeleteRatingAsync(int id);

        Task UpdateRatingAsync(Rating noti);
    }
}