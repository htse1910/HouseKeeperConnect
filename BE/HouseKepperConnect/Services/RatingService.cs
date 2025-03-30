using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class RatingService : IRatingService
    {
        private readonly IRatingRepository _repository;

        public RatingService(IRatingRepository repository)
        {
            _repository = repository;
        }
        public async Task AddRatingAsync(Rating ra) => await _repository.AddRatingAsync(ra);

        public async Task DeleteRatingAsync(int id) => await _repository.DeleteRatingAsync(id);

        public async Task<List<Rating>> GetAllRatingsAsync(int pageNumber, int pageSize) => await _repository.GetAllRatingsAsync(pageNumber, pageSize);

        public async Task<Rating> GetRatingByIDAsync(int id) => await _repository.GetRatingByIDAsync(id);

        public async Task<List<Rating>> GetRatingsByFAAsync(int uId, int pageNumber, int pageSize) => await _repository.GetRatingsByFAAsync(uId, pageNumber, pageSize);

        public async Task<List<Rating>> GetRatingsByHKAsync(int uId, int pageNumber, int pageSize) => await _repository.GetRatingsByHKAsync(uId, pageNumber, pageSize);

        public async Task UpdateRatingAsync(Rating noti) => await _repository.UpdateRatingAsync(noti);
    }
}
