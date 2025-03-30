using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class RatingRepository : IRatingRepository
    {
        public async Task AddRatingAsync(Rating ra) => await RatingDAO.Instance.AddRatingAsync(ra);

        public async Task DeleteRatingAsync(int id) => await RatingDAO.Instance.DeleteRatingAsync(id);

        public async Task<List<Rating>> GetAllRatingsAsync(int pageNumber, int pageSize) => await RatingDAO.Instance.GetAllRatingsAsync(pageNumber, pageSize);

        public async Task<Rating> GetRatingByIDAsync(int id) => await RatingDAO.Instance.GetRatingByIDAsync(id);

        public async Task<List<Rating>> GetRatingsByFAAsync(int uId, int pageNumber, int pageSize) => await RatingDAO.Instance.GetRatingsByFAAsync(uId, pageNumber, pageSize);

        public async Task<List<Rating>> GetRatingsByHKAsync(int uId, int pageNumber, int pageSize) => await RatingDAO.Instance.GetRatingsByHKAsync(uId, pageNumber, pageSize);
        public async Task UpdateRatingAsync(Rating noti) => await RatingDAO.Instance.UpdateRatingAsync(noti);
    }
}
