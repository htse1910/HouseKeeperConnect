using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class RatingDAO
    {
        private static RatingDAO instance;
        private static readonly object instancelock = new object();

        public RatingDAO()
        { }

        public static RatingDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new RatingDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Rating>> GetAllRatingsAsync(int pageNumber, int pageSize)
        {
            var list = new List<Rating>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Rating.AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Rating> GetRatingByIDAsync(int id)
        {
            Rating Rating = new Rating();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    Rating = await context.Rating.SingleOrDefaultAsync(x => x.RatingID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return Rating;
        }

        //With paging
        public async Task<List<Rating>> GetRatingsByHKAsync(int uId, int pageNumber, int pageSize)
        {
            var trans = new List<Rating>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    trans = await context.Rating.Include(t => t.Housekeeper).Where(t => t.HouseKeeperID == uId).OrderBy(n => n.CreateAt)
                        .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return trans;
        }

        public async Task<List<Rating>> GetRatingsByHKAsync(int uId)
        {
            var trans = new List<Rating>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    trans = await context.Rating.Include(t => t.Housekeeper).Where(t => t.HouseKeeperID == uId).OrderBy(n => n.CreateAt).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return trans;
        }

        public async Task<List<Rating>> GetRatingsByFAAsync(int uId, int pageNumber, int pageSize)
        {
            var trans = new List<Rating>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    trans = await context.Rating.Include(t => t.Family).Where(t => t.FamilyID == uId).OrderBy(n => n.CreateAt)
                        .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return trans;
        }

        public async Task AddRatingAsync(Rating noti)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Rating.Add(noti);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteRatingAsync(int id)
        {
            var Rating = await GetRatingByIDAsync(id);
            if (Rating != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Rating.Remove(Rating);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateRatingAsync(Rating noti)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(noti).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}