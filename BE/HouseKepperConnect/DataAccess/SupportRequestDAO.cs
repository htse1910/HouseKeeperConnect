using AutoMapper;
using BusinessObject.Models;
using BusinessObject.Models.Enum;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class SupportRequestDAO
    {
        private readonly IMapper _mapper;
        private static SupportRequestDAO instance;
        private static readonly object instancelock = new object();

        public SupportRequestDAO()
        {
        }

        public static SupportRequestDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new SupportRequestDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<SupportRequest>> GetAllSupportRequestsAsync(int pageNumber, int pageSize)
        {
            var list = new List<SupportRequest>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.SupportRequests.AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<List<SupportRequest>> GetAllPendingSupportRequestsAsync(int pageNumber, int pageSize)
        {
            var list = new List<SupportRequest>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.SupportRequests.Where(s => s.Status == (int)SupportRequestStatus.Processing).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<SupportRequest> GetSupportRequestByIDAsync(int uID)
        {
            SupportRequest SupportRequest;
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    SupportRequest = await context.SupportRequests.SingleOrDefaultAsync(x => x.RequestID == uID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return SupportRequest;
        }

        public async Task<List<SupportRequest>> GetSupportRequestByUserAsync(int id, int pageNumber, int pageSize)
        {
            var list = new List<SupportRequest>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.SupportRequests.Where(s => s.RequestedBy == id).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task AddSupportRequestAsync(SupportRequest SupportRequest)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.SupportRequests.Add(SupportRequest);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteSupportRequestAsync(int id)
        {
            var SupportRequest = await GetSupportRequestByIDAsync(id);
            if (SupportRequest != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.SupportRequests.Remove(SupportRequest);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateSupportRequestAsync(SupportRequest SupportRequest)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(SupportRequest).State = EntityState.Modified;
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